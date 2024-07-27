<script lang="ts">
  import leaflet, { type LeafletMouseEventHandlerFn } from "leaflet";
  import debounce from "lodash/debounce";
  import { onMount } from "svelte";
  import {
    areaBounds,
    areaCenter,
    areaRadius,
    chosenPoint,
    currentQuestion,
    currentQuestionIndex,
    didOpenMultiplayerSessionUrl,
    interactionVerb,
    isAreaConfirmed,
    isChosenPointConfirmed,
    ongoingZoomCount,
    round,
    sidebarState,
  } from "./store";

  import * as locateControl from "./locateControl";
  import drawTarget from "./utilities/drawTarget";
  import getNearestPointOnPolyLine from "./utilities/getNearestPointOnPolyLine";
  import getViewportWidth from "./utilities/getViewportWidth";
  import reduceLatLngPrecision from "./utilities/reduceLatLngPrecision";
  import type { Question, Round } from "./utilities/types";
  import trackEvent from "./utilities/trackEvent";
  import delay from "./utilities/delay";
  import capLng from "./utilities/capLng";
  import roundNumber from "./utilities/roundNumber";
  import waitForAnyOngoingZoomsToEnd from "./utilities/waitForAnyOngoingZoomsToEnd";
  import { writable } from "svelte/store";
  import type { HTMLSharpImage } from "./customElements";

  const shouldUseSimpleTileLayers = true;
  const shouldAlwaysShowBaseTileLayer = !shouldUseSimpleTileLayers;
  const getBoundsPaddingWhenMarkingBounds = () =>
    getViewportWidth() >= 800 ? 0.2 : 0;
  export let areSettingsShown = writable(false);

  let areaBoundsCircle: leaflet.Circle;
  let areaBoundsCenterMarker: leaflet.Circle;
  // The options passed to markBounds() when starting a new round, i.e. for area selection
  const areaSelectionMarkBoundsOptions = {
    shouldShowAreaBoundsPopup: true,
  };
  const defaultMinZoom = 3.5;
  let chosenPointMarker: leaflet.Marker | null;
  let hasShownPredefinedAreaChangedWarning: boolean;
  let map: leaflet.Map;
  let mapElement: HTMLElement;
  const maxMapZoom = 23; // https://github.com/adam-lynch/back-of-your-hand/issues/38#issuecomment-1079887466
  let resultFeatureGroup: leaflet.FeatureGroup | null;

  const CustomTileLayer = leaflet.TileLayer.extend({
    createTile: function (coords: unknown, done: () => void) {
      const tile = document.createElement("sharp-img") as HTMLSharpImage;
      tile.onload = leaflet.bind(this._tileOnLoad, this, done, tile);
      tile.onerror = leaflet.bind(this._tileOnError, this, done, tile);

      tile.alt = "";
      tile.src = this.getTileUrl(coords);
      tile.setAttribute("role", "presentation");

      return tile;
    },
  }) as unknown as typeof leaflet.TileLayer;

  const getTileLayer = (name: "base" | "labels") => {
    const nameToUrlMap = {
      base: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      labels:
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png",
    };

    return new CustomTileLayer(nameToUrlMap[name], {
      attribution:
        '\u003ca href="https://carto.com/legal/" target="_blank"\u003e\u0026copy; Carto\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
      maxNativeZoom: 18,
      maxZoom: maxMapZoom,
    });
  };

  const tileLayers = {
    base: getTileLayer("base"),
    labels: getTileLayer("labels"),
  };

  let areElementLabelsShown = true;

  // Used when intializing, plus when updating its style (when starting a new round)
  const areaBoundsCircleSelectionStyle = {
    color: "#ff2882",
    fillColor: "#ff2882",
    fillOpacity: 0.05,
    interactive: false,
    weight: 5,
    opacity: 0.5,
  };

  // Draw the area bounds circle
  const markBounds = ({
    shouldShowAreaBoundsPopup,
  }: {
    shouldShowAreaBoundsPopup?: boolean;
  }) => {
    const newAreaBoundsCircle = leaflet
      .circle($areaCenter, {
        ...areaBoundsCircleSelectionStyle,
        radius: $areaRadius,
      })
      .addTo(map);

    const newAreaBoundsCenterMarker = leaflet
      .circle($areaCenter, {
        ...areaBoundsCircleSelectionStyle,
        fillOpacity: 0.75,
        opacity: 0,
        radius: $areaRadius / 50,
      })
      .addTo(map);

    if (shouldShowAreaBoundsPopup) {
      newAreaBoundsCenterMarker.bindPopup(
        `To select a different area, you can zoom out and ${$interactionVerb.toLowerCase()} anywhere on the map.`,
      );
      newAreaBoundsCenterMarker.openPopup();
    }

    const newAreaBounds = newAreaBoundsCircle.getBounds();
    areaBounds.set(newAreaBounds);

    const boundsToFitInView = newAreaBoundsCircle
      .getBounds()
      .pad(getBoundsPaddingWhenMarkingBounds());
    map.flyToBounds(boundsToFitInView, {
      animate: true,
      duration: 0.75,
    });

    if (areaBoundsCircle) {
      map.removeLayer(areaBoundsCircle);
    }
    if (areaBoundsCenterMarker) {
      map.removeLayer(areaBoundsCenterMarker);
    }
    areaBoundsCircle = newAreaBoundsCircle;
    areaBoundsCenterMarker = newAreaBoundsCenterMarker;
  };

  const hideElementLabels = async (): Promise<void> => {
    if (!areElementLabelsShown) {
      return;
    }

    if (!shouldAlwaysShowBaseTileLayer) {
      await new Promise<void>((resolve) => {
        tileLayers.base.once("add", () => resolve()).addTo(map);
      });
    }

    map.removeLayer(tileLayers.labels);
    areElementLabelsShown = false;
  };

  const showElementLabels = async (): Promise<void> => {
    if (areElementLabelsShown) {
      return;
    }

    await new Promise<void>((resolve) => {
      tileLayers.labels.once("add", () => resolve()).addTo(map);
    });

    if (!shouldAlwaysShowBaseTileLayer) {
      map.removeLayer(tileLayers.base);
    }
    areElementLabelsShown = true;
  };

  // I.e. when they've confirmed the area selection
  const onAreaConfirmed = () => {
    if (!$areaBounds) {
      throw new Error("No areaBounds");
    }
    hideElementLabels();
    locateControl.remove(map);
    map
      .fitBounds($areaBounds)
      // Allow some over-scrolling so it's not too awkward for streets near the edge
      .setMaxBounds($areaBounds.pad(0.12))
      .setMinZoom(12);

    areaBoundsCircle.setStyle({
      color: "#37003c",
      fill: false,
      stroke: true,
      opacity: 0.4,
    });

    areaBoundsCenterMarker.closePopup().unbindPopup();

    map.removeLayer(areaBoundsCenterMarker);
  };

  // When they've confirmed their guess, compute and draw result
  const onChosenPointConfirmed = async () => {
    if (!$currentQuestion) {
      throw new Error("No currentQuestion");
    }

    if (!chosenPointMarker) {
      throw new Error("chosenPointMarker is falsy");
    }

    /* First, compute the distance / score */

    const chosenLatLng = chosenPointMarker.getLatLng();

    await waitForAnyOngoingZoomsToEnd();

    // This is used to compute the distance but we'll also use it to visualize the distance
    const { distance, latLng: nearestPointOnStreet } =
      await getNearestPointOnPolyLine(
        map,
        chosenLatLng,
        $currentQuestion.target.points as Question["target"]["points"],
      );

    let score = 0;
    if (distance < 1) {
      const massagedDistance = Math.max(distance, 0.015) - 0.015;
      score = Math.floor((1 - massagedDistance) * 100);
    }

    /* Then update the round / question state */

    const currentQuestionUpdates: Partial<Question> = {
      distance: {
        amount: distance * 1000,
        unit: "metres",
      },
      score,
      status: "complete",
    };
    round.update((value) => {
      if (!value) {
        throw new Error("round is falsy");
      }

      const result: Round = {
        ...value,
        questions: value.questions.map((question) => {
          if (question === $currentQuestion) {
            return {
              ...question,
              ...currentQuestionUpdates,
            };
          }
          return question;
        }),
      };

      return result;
    });

    /* Then draw the result & reveal the street */

    resultFeatureGroup = leaflet.featureGroup().addTo(map);

    const { targetLayer } = drawTarget({
      layer: resultFeatureGroup,
      question: { ...$currentQuestion, ...currentQuestionUpdates },
      shouldDrawCircle: true,
    });

    if (distance > 0 && nearestPointOnStreet) {
      const distancePolyline = leaflet
        .polyline([chosenLatLng, nearestPointOnStreet], {
          color: "black",
          dashArray: "10 10",
          weight: 1,
        })
        .addTo(resultFeatureGroup);
      distancePolyline.bringToFront();
    }

    targetLayer.bringToFront();

    /* Zoom in on result and reveal street names */

    showElementLabels();
    await delay(100);
    if (!resultFeatureGroup) {
      return;
    }

    map.fitBounds(resultFeatureGroup.getBounds().pad(0.2));
  };

  const onMapClick: LeafletMouseEventHandlerFn = (e) => {
    const latLng = {
      ...e.latlng,
      lng: capLng(e.latlng.lng),
    };

    // They're selecting an area
    if (!$isAreaConfirmed) {
      const updateCenter = () => areaCenter.set(reduceLatLngPrecision(latLng));

      // If they came in with a seed and then change the area, warn them
      if (
        !$round &&
        $didOpenMultiplayerSessionUrl &&
        !hasShownPredefinedAreaChangedWarning
      ) {
        hasShownPredefinedAreaChangedWarning = true;
        trackEvent({
          name: "change-prefined-area-seed_attempted",
          title: "Change predefined area-seed: attempted",
        });
        if (
          confirm(
            "The link you opened contains a pre-defined area and set of streets. A friend may have given you the URL so you could compete. \n\nChange the area anyway?",
          )
        ) {
          trackEvent({
            name: "change-prefined-area-seed_confirmed",
            title: "Change predefined area-seed: confirmed",
          });
          updateCenter();
        } else {
          trackEvent({
            name: "change-prefined-area-seed_cancelled",
            title: "Change predefined area-seed: cancelled",
          });
        }
      } else {
        updateCenter();
      }
      return;
    }

    // They're marking their guess
    if (!$isChosenPointConfirmed) {
      chosenPoint.set(latLng);
    }
  };

  const initializeMap = () => {
    leaflet.Icon.Default.prototype.options.imagePath = "/images/leaflet/";

    const viewportWidth = getViewportWidth();
    const initialMapOptions = {
      boxZoom: false,
      doubleClickZoom: false,
      layers: shouldAlwaysShowBaseTileLayer
        ? Object.values(tileLayers)
        : [tileLayers.labels],
      minZoom: defaultMinZoom,
      zoomControl: false,
      zoomSnap: 0.25,
    };

    const zoomControl = leaflet.control.zoom({
      position: "topright",
      zoomInText: "&#43;" + (viewportWidth > 800 ? "&emsp;Zoom in" : ""),
      zoomOutText: "&minus;" + (viewportWidth > 800 ? "&emsp;Zoom out" : ""),
    });

    map = leaflet
      .map(mapElement, initialMapOptions)
      .on("click", onMapClick)
      .on("zoomend", () => {
        /*
          I wish we could we track each zoomstart event and wait for an equal
          number zoomend events, but I've seen this happen:
          1. zoomstart
          2. zoomstart
          3. zoomend
        */
        ongoingZoomCount.set(0);
      })
      .on("zoomstart", () => {
        ongoingZoomCount.update((currentZoomCount) => currentZoomCount + 1);
      })
      .fitBounds(
        leaflet
          .latLng($areaCenter)
          .toBounds($areaRadius)
          .pad(getBoundsPaddingWhenMarkingBounds()),
      )
      .addControl(zoomControl);

    locateControl.add(map);

    map.attributionControl.setPrefix("");

    // Let leaflet know when the map container changes size (e.g. when the context-panel grows)
    if (window.ResizeObserver !== undefined) {
      new ResizeObserver(
        debounce(
          () => {
            if (map) {
              map.invalidateSize();
            }
          },
          200,
          { leading: true },
        ),
      ).observe(mapElement);
    }
  };

  // Remove polylines, markers, etc. from map. Used when moving to a new street, etc.
  const resetMap = (shouldFitBounds = true, shouldShowStreets = false) => {
    if (shouldShowStreets) {
      showElementLabels();
    } else {
      hideElementLabels();
    }

    if (resultFeatureGroup) {
      map.removeLayer(resultFeatureGroup);
      resultFeatureGroup = null;
    }
    if (shouldFitBounds && $areaBounds) {
      map.fitBounds($areaBounds).once("zoomend", () => {
        // This prevents the map going (and staying gray) on Firefox for Android sometimes
        map.panBy([1, 1]);
      });
    }
  };

  // Draw all streets on the map, etc.
  const showSummary = debounce(() => {
    if (!$round) {
      throw new Error("No round");
    }
    chosenPoint.set(null);
    resetMap(false, true);

    resultFeatureGroup = leaflet.featureGroup().addTo(map);

    $round.questions.forEach((question) => {
      const { targetLayer } = drawTarget({
        color: "#ff2882",
        layer: resultFeatureGroup as NonNullable<typeof resultFeatureGroup>,
        question,
      });
      const tooltipContentElement = document.createElement("span");
      tooltipContentElement.classList.add("summary-street-tooltip");
      tooltipContentElement.classList.add("single-line-text-overflow");
      tooltipContentElement.innerText = `${question.target.name}`;
      if (question.target.alternativeName) {
        tooltipContentElement.innerText += ` (${question.target.alternativeName})`;
      }

      targetLayer
        .bindTooltip(tooltipContentElement, {
          direction: "top",
          permanent: true,
          // Accommodate larger font-size
          offset: leaflet.point(0, getViewportWidth() >= 800 ? -15 : -10),
          opacity: 0.7,
        })
        .openTooltip();
    });

    map.fitBounds(resultFeatureGroup.getBounds().pad(0.1));
  }, 50);

  onMount(() => {
    initializeMap();

    /* The following are store subscriptions, i.e. reactions to state changes */

    // Mark the area bounds whenever the center point changes
    areaCenter.subscribe((value) => {
      if (!value) {
        return;
      }

      // If it hasn't changed, add a little animation as some feedback for the locate button press
      const currrentMapCenterLatLng = map.getCenter();
      const numberOfDecimalPointsToConsider = 4;
      const hasChanged =
        roundNumber(
          currrentMapCenterLatLng.lat,
          numberOfDecimalPointsToConsider,
        ) !== roundNumber(value.lat, numberOfDecimalPointsToConsider) ||
        roundNumber(
          currrentMapCenterLatLng.lng,
          numberOfDecimalPointsToConsider,
        ) !== roundNumber(value.lng, numberOfDecimalPointsToConsider);

      if (!hasChanged) {
        map.zoomOut(1, {
          animate: false,
        });
        setTimeout(() => {
          markBounds(areaBoundsCircle ? {} : areaSelectionMarkBoundsOptions);
        }, 250);
        return;
      }

      markBounds(areaBoundsCircle ? {} : areaSelectionMarkBoundsOptions);
    });

    areaRadius.subscribe((value) => {
      if (!value) {
        return;
      }

      markBounds(areaBoundsCircle ? {} : areaSelectionMarkBoundsOptions);
    });

    // Mark their guess
    chosenPoint.subscribe((value) => {
      if (chosenPointMarker) {
        map.removeLayer(chosenPointMarker);
        chosenPointMarker = null;
      }

      if (!value) {
        return;
      }

      chosenPointMarker = leaflet.marker(value).addTo(map);

      // Zoom in a litle to help them see how close they really are
      const currentZoom = map.getZoom();
      const minDesiredZoom = 17;
      if (currentZoom < 18) {
        // Keep the new zoom within the max and min zoom levels we'd like
        let newZoom = Math.max(
          Math.min(currentZoom + 3, maxMapZoom),
          minDesiredZoom,
        );
        setTimeout(() => {
          if (!chosenPointMarker) {
            console.warn("No chosenPointMarker, skipping map.flyTo");
            return;
          }
          map.flyTo(chosenPointMarker.getLatLng(), newZoom, {
            animate: true,
            duration: 0.5,
          });
        }, 250);
      }
    });

    // When they confirm their guess, or when it's reset when moving to another street / round
    isChosenPointConfirmed.subscribe((isConfirmed) => {
      if (isConfirmed) {
        onChosenPointConfirmed();
        return;
      }

      // Moved onto new street / challenge. Reset the map to be safe
      if ($isAreaConfirmed) {
        resetMap();
      }
    });

    // React to the area being confirmed / unset
    isAreaConfirmed.subscribe((isConfirmed) => {
      // They've chosen to start a new round, back to area selection
      if (!isConfirmed) {
        // @ts-expect-error I don't see any other way to do this
        map.setMaxBounds(null).setMinZoom(defaultMinZoom);
        resetMap(false, true);
        locateControl.add(map);
        markBounds(areaSelectionMarkBoundsOptions);
        areaBoundsCircle.setStyle(areaBoundsCircleSelectionStyle);

        return;
      }

      // Area has become confirmed, round starting...
      onAreaConfirmed();
    });

    // Show summary
    sidebarState.subscribe((value) => {
      if (value === "summary") {
        showSummary();
      } else if ($isAreaConfirmed) {
        // Reset the map to be safe
        resetMap(true, true);
      }
    });

    // When we move to the next question, reset the map
    currentQuestionIndex.subscribe((value) => {
      if (value) {
        resetMap();
      }
    });
  });

  const closeSettingsForSmallDevices = () => {
    if (window.innerWidth <= 1100) {
      areSettingsShown.set(false);
    }
  };
</script>

<div
  on:pointerdown={closeSettingsForSmallDevices}
  bind:this={mapElement}
  id="map"
/>

<style
  global
  lang="postcss"
>
  :global(body) {
    & .leaflet-control-container .leaflet-top.leaflet-right {
      display: flex;
      flex-direction: column;
    }

    & .leaflet-bar a,
    & .leaflet-touch .leaflet-bar a {
      height: auto !important;
      width: auto !important;
      padding: 2px 10px !important;
    }

    & .leaflet-bar a,
    & .leaflet-bar button,
    & .leaflet-touch .leaflet-bar a {
      font-size: 1.2rem !important;
      font-weight: bold !important;
      text-align: left !important;
    }

    @media (min-width: 800px) {
      & .leaflet-bar a,
      & .leaflet-bar button,
      & .leaflet-touch .leaflet-right a {
        padding: 2px 7px 2px 10px !important;
        font-size: 1rem !important;
      }
    }

    & .leaflet-control-zoom-in,
    & .leaflet-control-zoom-out {
      user-select: none;
    }

    & .leaflet-control-zoom-in:active,
    & .leaflet-control-zoom-in:hover,
    & .leaflet-control-zoom-out:active,
    & .leaflet-control-zoom-out:hover {
      opacity: 1;
    }

    & .leaflet-control-zoom-in.leaflet-disabled,
    & .leaflet-control-zoom-out.leaflet-disabled {
      /* Just hide it rather than have an inaccessible colour contrast */
      display: none;
    }

    & .leaflet-locate-control {
      display: flex;
      background: #fff;
      cursor: pointer;
      /* Copied from leaflet zoom control */
      font:
        bold 18px "Lucida Console",
        Monaco,
        monospace;
    }

    & .leaflet-locate-control:hover {
      background: #f4f4f4;
    }

    & .leaflet-locate-control button,
    & .leaflet-locate-control button:active,
    & .leaflet-locate-control button:focus,
    & .leaflet-locate-control :hover {
      all: unset;
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      min-height: 34px;
      line-height: 30px;
      box-shadow: none;
      cursor: pointer;
    }

    @media (min-width: 800px) {
      & .leaflet-locate-control button,
      & .leaflet-locate-control button:active,
      & .leaflet-locate-control button:focus,
      & .leaflet-locate-control button:hover {
        padding-left: 5px !important;
      }
    }

    & .leaflet-locate-control svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
    }

    @media (min-width: 800px) {
      & .leaflet-locate-control svg {
        position: static;
        transform: none;
      }
    }

    & .leaflet-locate-control span {
      position: relative;
      top: 1px;
      margin-left: 6px;
    }

    & .leaflet-container a.leaflet-popup-close-button {
      /* For better colour contrast */
      color: #636363;
    }

    & .leaflet-tooltip {
      color: black;
      opacity: 0.8 !important;
    }

    & #map:not(.leaflet-safari) .leaflet-tile-container {
      filter: grayscale(0.8);
    }

    & #map:not(.leaflet-safari) .leaflet-tile {
      filter: saturate(8) hue-rotate(-10deg);
    }

    /* Safari filters are broken */
    & .leaflet-safari .leaflet-tile-pane .leaflet-layer {
      filter: grayscale(0.9);
    }
    & .leaflet-safari .leaflet-tile-container {
      filter: saturate(4) hue-rotate(-10deg);
    }

    & sharp-img {
      position: relative;
      overflow: hidden;
    }

    & sharp-img img {
      display: block;
      width: 100%;
      height: 100%;
    }

    & sharp-img .sharpen {
      mix-blend-mode: hard-light;
    }

    & sharp-img .sharpen,
    & sharp-img .sharpen::before,
    & sharp-img .sharpen::after {
      position: absolute;
      inset: 0;
    }

    & sharp-img .sharpen::before,
    & sharp-img .sharpen::after {
      content: "";
      background-image: var(--sharp-img-css-background-image);
      background-repeat: no-repeat;
    }

    & sharp-img .sharpen::after {
      filter: invert(1);
      opacity: 0.5;
      top: -1px;
      left: -1px;
    }

    & #map {
      height: 100%;
      flex: 1;
      grid-area: map;
    }
  }
</style>
