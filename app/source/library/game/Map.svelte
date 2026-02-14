<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
  
  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import "@maplibre/maplibre-gl-leaflet";
  import * as versatilesStyles from "@versatiles/style";
  import leaflet, { type LeafletMouseEventHandlerFn } from "leaflet";
  import debounce from "lodash/debounce";
  import { onMount } from "svelte";
  import * as svelteStore from "svelte/store";

  import * as locateControl from "./locateControl";
  import drawTarget from "../../utilities/drawTarget";
  import getNearestPointOnPolyLine from "../../utilities/getNearestPointOnPolyLine";
  import getViewportWidth from "../../utilities/getViewportWidth";
  import type { GameRound, Question } from "./types";
  import delay from "../../utilities/delay";
  import * as defaults from "../../utilities/defaults";
  import capLng from "../../utilities/capLng";
  import roundNumber from "../../utilities/roundNumber";
  import waitForAnyOngoingZoomsToEnd from "../../utilities/waitForAnyOngoingZoomsToEnd";
  import { writable } from "svelte/store";
  import createLeafletFeatureGroupFromAreaSelection from "../utilities/createLeafletFeatureGroupFromAreaSelection";
  import updateAreaCenterWithWarningIfNecessary from "../utilities/updateAreaCenterWithWarningIfNecessary";
  import {
    areaCenter,
    areaRadius,
    areaSelection,
    areaShape,
    chosenPoint,
    currentQuestion,
    currentQuestionIndex,
    interactionVerb,
    isAreaConfirmed,
    isChosenPointConfirmed,
    ongoingZoomCount,
    gameRound,
    sidebarState,
  } from "../../utilities/store";
  import { isOrganizationUrl } from "../../userData/store";

  const getBoundsPaddingWhenMarkingBounds = () =>
    getViewportWidth() >= 800 ? 0.2 : 0;
  export let areSettingsShown = writable(false);

  let areaBoundsFeatureGroup: leaflet.FeatureGroup<leaflet.Path> | null = null;
  let areaBoundsCenterMarker: leaflet.Circle | null = null;
  // The options passed to markBounds() when starting a new round, i.e. for area selection
  const areaSelectionMarkBoundsOptions = {
    shouldShowAreaBoundsPopup: true,
  };
  const fallbackAreaCenter: leaflet.LatLngLiteral = {
    lat: 51.89863,
    lng: -8.47039,
  };
  const defaultMinZoom = 3.5;
  let chosenPointMarker: leaflet.Marker | null;
  let map: leaflet.Map;
  let mapElement: HTMLElement;
  const maxMapZoom = 23; // https://github.com/adam-lynch/back-of-your-hand/issues/38#issuecomment-1079887466
  let resultFeatureGroup: leaflet.FeatureGroup | null;

  const isFiniteNumber = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);

  const isLatLngLiteralFinite = (
    latLng: leaflet.LatLngLiteral | null | undefined,
  ): latLng is leaflet.LatLngLiteral =>
    Boolean(latLng) &&
    isFiniteNumber(latLng?.lat) &&
    isFiniteNumber(latLng?.lng);

  const getValidBoundsWithCenter = (
    bounds: leaflet.LatLngBounds | null | undefined,
  ) => {
    if (!bounds || !bounds.isValid()) {
      return null;
    }

    try {
      const center = bounds.getCenter();
      if (!isLatLngLiteralFinite(center)) {
        return null;
      }
      return { bounds, center };
    } catch (error) {
      console.warn("Encountered invalid bounds", error);
      return null;
    }
  };

  const getSafeAreaCenter = (): leaflet.LatLngLiteral =>
    isLatLngLiteralFinite($areaCenter) ? $areaCenter : fallbackAreaCenter;

  const getSafeAreaRadius = (): number =>
    isFiniteNumber($areaRadius) && $areaRadius > 0
      ? $areaRadius
      : defaults.radius;

  function createStyle(name: "base" | "labels") {
    return versatilesStyles.colorful({
      baseUrl: "https://tiles.versatiles.org/tiles/osm",
      hideLabels: name === "base",
    });
  }

  const getTileLayer = (name: "base" | "labels") =>
    new leaflet.MaplibreGL({
      maxZoom: maxMapZoom,
      style: createStyle(name),
    });

  const tileLayer = getTileLayer("labels");

  let areElementLabelsShown = true;
  let maplibreLabelLayerIds: string[] | null = null;

  // Used when intializing, plus when updating its style (when starting a new round)
  const areaBoundsLayerGroupSelectionStyle = {
    color: "#ff2882",
    fillColor: "#ff2882",
    fillOpacity: 0.05,
    interactive: false,
    weight: 5,
    opacity: 0.5,
  };

  // Draw the area bounds shape
  const markBounds = ({
    shouldShowAreaBoundsPopup,
  }: {
    shouldShowAreaBoundsPopup?: boolean;
  }) => {
    const newAreaBoundsFeatureGroup =
      createLeafletFeatureGroupFromAreaSelection(
        svelteStore.get(areaSelection),
        areaBoundsLayerGroupSelectionStyle,
      ).addTo(map);

    let newAreaBoundsWithCenter: ReturnType<typeof getValidBoundsWithCenter>;
    try {
      newAreaBoundsWithCenter = getValidBoundsWithCenter(
        newAreaBoundsFeatureGroup.getBounds(),
      );
    } catch (error) {
      console.warn(
        "Skipping markBounds; failed to compute bounds",
        error,
        svelteStore.get(areaSelection),
      );
      map.removeLayer(newAreaBoundsFeatureGroup);
      return;
    }

    if (!newAreaBoundsWithCenter) {
      console.warn(
        "Skipping markBounds; computed bounds are invalid",
        svelteStore.get(areaSelection),
      );
      map.removeLayer(newAreaBoundsFeatureGroup);
      return;
    }
    const { bounds: newAreaBounds, center: newAreaBoundsCenter } =
      newAreaBoundsWithCenter;

    const newAreaBoundsCenterMarker = leaflet
      .circle(newAreaBoundsCenter, {
        ...areaBoundsLayerGroupSelectionStyle,
        // Hide if there are multiple polygons; it doesn't look right if it's floating in the middle of nothing
        fillOpacity:
          $areaSelection.feature.geometry.type === "MultiPolygon" &&
          $areaSelection.feature.geometry.coordinates.length > 1
            ? 0
            : 0.75,
        opacity: 0,
        radius:
          newAreaBoundsCenter.distanceTo(newAreaBounds.getNorthEast()) / 50,
      })
      .addTo(map);

    if (shouldShowAreaBoundsPopup && !$isOrganizationUrl) {
      newAreaBoundsCenterMarker.bindPopup(
        `To select a different area, you can zoom out and ${$interactionVerb.toLowerCase()} anywhere on the map.`,
      );
      newAreaBoundsCenterMarker.openPopup();
    }

    const boundsToFitInView = newAreaBounds.pad(
      getBoundsPaddingWhenMarkingBounds(),
    );

    /*
      Rarely, there's a weird unfixable issue deep in Leaflet with animations (I think it's https://github.com/Leaflet/Leaflet/issues/3249 but I'm not sure).
      If the error occurs, we rerun it without animating.
    */
    const flyToBoundsArgs: Parameters<typeof map.flyToBounds> = [
      boundsToFitInView,
      {
        animate: true,
        duration: 0.75,
      },
    ];
    try {
      map.flyToBounds(...flyToBoundsArgs);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Invalid LatLng object: (NaN, NaN)")
      ) {
        error.message += ". Trying again...";
        console.warn(error);
        map.flyToBounds(flyToBoundsArgs[0], {
          ...flyToBoundsArgs[1],
          animate: false,
        });
      } else {
        throw error;
      }
    }

    if (areaBoundsFeatureGroup) {
      map.removeLayer(areaBoundsFeatureGroup);
    }
    if (areaBoundsCenterMarker) {
      map.removeLayer(areaBoundsCenterMarker);
    }
    areaBoundsFeatureGroup = newAreaBoundsFeatureGroup;
    areaBoundsCenterMarker = newAreaBoundsCenterMarker;
  };

  const setMaplibreLabelVisibility = (shouldShow: boolean) => {
    const maplibreMap = tileLayer.getMaplibreMap();
    // To be safe
    if (!maplibreMap) {
      console.warn("Maplibre map unavailable, cannot toggle labels");
      return;
    }

    const applyVisibility = () => {
      if (!maplibreLabelLayerIds || maplibreLabelLayerIds.length === 0) {
        const style = maplibreMap.getStyle();
        if (!style?.layers) {
          return;
        }

        const hasTextOrIcon = (layout: unknown) =>
          Boolean(
            layout &&
              typeof layout === "object" &&
              ("text-field" in (layout as Record<string, unknown>) ||
                "icon-image" in (layout as Record<string, unknown>)),
          );

        maplibreLabelLayerIds = style.layers
          .filter(
            ({ layout, type }) => type === "symbol" || hasTextOrIcon(layout),
          )
          .map(({ id }) => id);
      }

      if (!maplibreLabelLayerIds || maplibreLabelLayerIds.length === 0) {
        return;
      }

      maplibreLabelLayerIds.forEach((layerId) => {
        try {
          maplibreMap.setLayoutProperty(
            layerId,
            "visibility",
            shouldShow ? "visible" : "none",
          );
        } catch (error) {
          console.warn("Failed toggling label layer visibility", {
            error,
            layerId,
          });
        }
      });
    };

    if (!maplibreMap.isStyleLoaded()) {
      maplibreMap.once("styledata", applyVisibility);
      return;
    }

    applyVisibility();
  };

  const hideElementLabels = async (): Promise<void> => {
    if (!areElementLabelsShown) {
      return;
    }

    setMaplibreLabelVisibility(false);
    areElementLabelsShown = false;
  };

  const showElementLabels = async (): Promise<void> => {
    if (areElementLabelsShown) {
      return;
    }

    setMaplibreLabelVisibility(true);
    areElementLabelsShown = true;
  };

  // I.e. when they've confirmed the area selection
  const onAreaConfirmed = () => {
    if (!areaBoundsFeatureGroup) {
      console.warn("Area confirmed but no bounds feature group exists yet");
      return;
    }

    hideElementLabels();
    locateControl.remove(map);

    const areaBoundsInfo = getValidBoundsWithCenter(
      areaBoundsFeatureGroup.getBounds(),
    );
    if (!areaBoundsInfo) {
      console.warn(
        "Area bounds invalid during confirmation; skipping map fit",
        svelteStore.get(areaSelection),
      );
      return;
    }
    const { bounds: areaBounds } = areaBoundsInfo;
    map
      .fitBounds(areaBounds)
      // Allow some over-scrolling so it's not too awkward for streets near the edge
      .setMaxBounds(areaBounds.pad(0.12))
      .setMinZoom(11);

    areaBoundsFeatureGroup.setStyle({
      color: "#37003c",
      fill: false,
      stroke: true,
      opacity: 0.4,
    });

    if (areaBoundsCenterMarker) {
      areaBoundsCenterMarker.closePopup().unbindPopup();
      map.removeLayer(areaBoundsCenterMarker);
    }
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

    // Has been reset?
    if (!$currentQuestion) {
      return;
    }

    // This is used to compute the distance but we'll also use it to visualize the distance
    const { distance, latLng: nearestPointOnStreet } =
      await getNearestPointOnPolyLine(
        map,
        chosenLatLng,
        $currentQuestion.target.points as Question["target"]["points"],
      );

    // Has been reset?
    if (!$currentQuestion) {
      return;
    }

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
    gameRound.update((value) => {
      if (!value) {
        throw new Error("round is falsy");
      }

      const result: GameRound = {
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
      updateAreaCenterWithWarningIfNecessary(latLng, true);
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
    const initialBoundsPadding = getBoundsPaddingWhenMarkingBounds();
    const initialAreaSelection = svelteStore.get(areaSelection);
    let selectionBounds: ReturnType<typeof getValidBoundsWithCenter> | null =
      null;
    try {
      selectionBounds = getValidBoundsWithCenter(
        createLeafletFeatureGroupFromAreaSelection(
          initialAreaSelection,
          areaBoundsLayerGroupSelectionStyle,
        ).getBounds(),
      );
    } catch (error) {
      console.warn("Falling back to default bounds", error);
    }
    const initialBoundsToUse =
      selectionBounds?.bounds ??
      leaflet
        .latLng(getSafeAreaCenter())
        .toBounds(getSafeAreaRadius())
        .pad(initialBoundsPadding);
    const initialMapOptions = {
      boxZoom: false,
      doubleClickZoom: false,
      layers: [tileLayer],
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
      .fitBounds(initialBoundsToUse.pad(initialBoundsPadding))
      .addControl(zoomControl);

    locateControl.add(map);

    map.attributionControl.setPrefix("");

    // Let leaflet know when the map container changes size (e.g. when the context-panel grows)
    if (window.ResizeObserver !== undefined) {
      new ResizeObserver(
        debounce(
          (entries) => {
            console.debug("ResizeObserver fired", {
              entriesCount: entries.length,
            });
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
    if (shouldFitBounds && areaBoundsFeatureGroup) {
      const boundsInfo = getValidBoundsWithCenter(
        areaBoundsFeatureGroup.getBounds(),
      );
      if (boundsInfo) {
        map.fitBounds(boundsInfo.bounds).once("zoomend", () => {
          // This prevents the map going (and staying gray) on Firefox for Android sometimes
          map.panBy([1, 1]);
        });
      }
    }
  };

  // Draw all streets on the map, etc.
  const showSummary = debounce(() => {
    if (!$gameRound) {
      throw new Error("No round");
    }
    chosenPoint.set(null);
    resetMap(false, true);

    resultFeatureGroup = leaflet.featureGroup().addTo(map);

    $gameRound.questions.forEach((question) => {
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

  const areaCenterAndSelection = svelteStore.derived(
    [areaCenter, areaSelection],
    ([$areaCenter, $areaSelection]) => ({
      $areaCenter,
      $areaSelection,
    }),
  );

  onMount(() => {
    const unsubscribers: (() => void)[] = [];

    initializeMap();

    /* The following are store subscriptions, i.e. reactions to state changes */

    // Mark the area bounds whenever the center point changes
    unsubscribers.push(
      areaCenterAndSelection.subscribe(() => {
        if (!$areaCenter) {
          return;
        }

        // If it hasn't changed, add a little animation as some feedback for the locate button press
        const currrentMapCenterLatLng = map.getCenter();
        const numberOfDecimalPointsToConsider = 4;
        const hasChanged =
          roundNumber(
            currrentMapCenterLatLng.lat,
            numberOfDecimalPointsToConsider,
          ) !== roundNumber($areaCenter.lat, numberOfDecimalPointsToConsider) ||
          roundNumber(
            currrentMapCenterLatLng.lng,
            numberOfDecimalPointsToConsider,
          ) !== roundNumber($areaCenter.lng, numberOfDecimalPointsToConsider);

        if (!hasChanged) {
          map.zoomOut(1, {
            animate: false,
          });
          setTimeout(() => {
            markBounds(
              areaBoundsFeatureGroup ? {} : areaSelectionMarkBoundsOptions,
            );
          }, 250);
          return;
        }

        markBounds(
          areaBoundsFeatureGroup ? {} : areaSelectionMarkBoundsOptions,
        );
      }),
    );

    unsubscribers.push(
      areaRadius.subscribe((value) => {
        if (!value) {
          return;
        }

        markBounds(
          areaBoundsFeatureGroup ? {} : areaSelectionMarkBoundsOptions,
        );
      }),
    );

    areaShape.subscribe((value) => {
      if (!value) {
        return;
      }

      markBounds(areaBoundsFeatureGroup ? {} : areaSelectionMarkBoundsOptions);
    });

    // Mark their guess
    unsubscribers.push(
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
      }),
    );

    // When they confirm their guess, or when it's reset when moving to another street / round
    unsubscribers.push(
      isChosenPointConfirmed.subscribe((isConfirmed) => {
        if (isConfirmed) {
          onChosenPointConfirmed();
          return;
        }

        // Moved onto new street / challenge. Reset the map to be safe
        if ($isAreaConfirmed) {
          resetMap();
        }
      }),
    );

    // React to the area being confirmed / unset
    unsubscribers.push(
      isAreaConfirmed.subscribe((isConfirmed) => {
        // They've chosen to start a new round, back to area selection
        if (!isConfirmed) {
          // @ts-expect-error I don't see any other way to do this
          map.setMaxBounds(null).setMinZoom(defaultMinZoom);
          resetMap(false, true);
          locateControl.add(map);
          markBounds(areaSelectionMarkBoundsOptions);
          areaBoundsFeatureGroup?.setStyle(areaBoundsLayerGroupSelectionStyle);

          return;
        }

        // Area has become confirmed, round starting...
        onAreaConfirmed();
      }),
    );

    // Show summary
    unsubscribers.push(
      sidebarState.subscribe((value) => {
        if (value === "summary") {
          showSummary();
        } else if ($isAreaConfirmed) {
          // Reset the map to be safe
          resetMap(true, true);
        }
      }),
    );

    // When we move to the next question, reset the map
    unsubscribers.push(
      currentQuestionIndex.subscribe((value) => {
        if (value) {
          resetMap();
        }
      }),
    );

    return () => {
      for (const unsubscriber of unsubscribers) {
        unsubscriber();
      }
    };
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
  data-testid="game-map"
  data-zooming={$ongoingZoomCount > 0 ? "" : undefined}
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
      font-weight: 500 !important;
      text-align: left !important;
      color: black !important;
    }

    @media (min-width: 800px) {
      & .leaflet-bar a,
      & .leaflet-bar button,
      & .leaflet-touch .leaflet-right a {
        font-size: 1rem !important;
      }

      & .leaflet-container .leaflet-control-attribution {
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
    & .leaflet-locate-control button:hover {
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
