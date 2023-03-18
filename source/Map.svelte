<script lang="ts">
  import leaflet from "leaflet";
  import debounce from "lodash/debounce";
  import { onMount } from 'svelte';
  import { areaBounds, areaCenter, areaRadius, chosenPoint, currentQuestion, currentQuestionIndex, gotInitialSeedFromUrl, interactionVerb, isAreaConfirmed, isChosenPointConfirmed, isSummaryShown, ongoingZoomCount, round } from './store';

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

  const shouldUseSimpleTileLayers = true;
  const shouldAlwaysShowBaseTileLayer = !shouldUseSimpleTileLayers;
  const getBoundsPaddingWhenMarkingBounds = () => getViewportWidth() >= 800 ? 0.2 : 0;
  export let areSettingsShown = writable(false);

  let areaBoundsCircle: leaflet.Circle;
  let areaBoundsCenterMarker: leaflet.Circle;
  // The options passed to markBounds() when starting a new round, i.e. for area selection
  const areaSelectionMarkBoundsOptions = {
    shouldShowAreaBoundsPopup: true,
  };
  const defaultMinZoom = 3.5;
  let chosenPointMarker: leaflet.Marker;
  let hasShownPredefinedAreaChangedWarning: boolean;
  let map: leaflet.Map;
  let mapElement: HTMLElement;
  const maxMapZoom = 23; // https://github.com/adam-lynch/back-of-your-hand/issues/38#issuecomment-1079887466
  let resultFeatureGroup: leaflet.FeatureGroup;

  const getTileLayer = (name: 'base' | 'labels') => {
    const nameToUrlMap = {
      base: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      labels: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png",
    };
    return leaflet.tileLayer(nameToUrlMap[name], {
      attribution: "\u003ca href=\"https://carto.com/legal/\" target=\"_blank\"\u003e\u0026copy; Carto\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
      maxNativeZoom: 18,
      maxZoom: maxMapZoom,
    })
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
    const newAreaBoundsCircle = leaflet.circle($areaCenter, {
      ...areaBoundsCircleSelectionStyle,
      radius: $areaRadius,
    }).addTo(map);

    const newAreaBoundsCenterMarker = leaflet.circle($areaCenter, {
      ...areaBoundsCircleSelectionStyle,
      fillOpacity: 0.75,
      opacity: 0,
      radius: $areaRadius / 50,
    }).addTo(map);

    if(shouldShowAreaBoundsPopup) {
      newAreaBoundsCenterMarker.bindPopup(
        `To select a different area, you can zoom out and ${$interactionVerb.toLowerCase()} anywhere on the map.`
      );
      newAreaBoundsCenterMarker.openPopup();
    }

    const newAreaBounds = newAreaBoundsCircle.getBounds();
    areaBounds.set(newAreaBounds);

    const boundsToFitInView = newAreaBoundsCircle.getBounds().pad(getBoundsPaddingWhenMarkingBounds());
    map.flyToBounds(boundsToFitInView, {
      animate: true,
      duration: 0.75,
    });

    if(areaBoundsCircle) {
      map.removeLayer(areaBoundsCircle);
    }
    if(areaBoundsCenterMarker) {
      map.removeLayer(areaBoundsCenterMarker);
    }
    areaBoundsCircle = newAreaBoundsCircle;
    areaBoundsCenterMarker = newAreaBoundsCenterMarker;
  };

  const hideElementLabels = async (): Promise<void> => {
    if(!areElementLabelsShown) {
      return;
    }

    if(!shouldAlwaysShowBaseTileLayer) {
      await new Promise<void>((resolve) => {
        tileLayers.base
          .once("add", () => resolve())
          .addTo(map);
      });
    }

    map.removeLayer(tileLayers.labels);
    areElementLabelsShown = false;
  };

  const showElementLabels = async (): Promise<void> => {
    if(areElementLabelsShown) {
      return;
    }

    await new Promise<void>((resolve) => {
      tileLayers.labels
        .once("add", () => resolve())
        .addTo(map);
    });

    if(!shouldAlwaysShowBaseTileLayer) {
      map.removeLayer(tileLayers.base);
    }
    areElementLabelsShown = true;
  };

  // I.e. when they've confirmed the area selection
  const onAreaConfirmed = () => {
    hideElementLabels();
    locateControl.remove(map);
    map.fitBounds($areaBounds)
      // Allow some over-scrolling so it's not too awkward for streets near the edge
      .setMaxBounds($areaBounds.pad(0.12))
      .setMinZoom(12);

    areaBoundsCircle
      .setStyle({
        color: "#37003c",
        fill: false,
        stroke: true,
        opacity: 0.4,
      });

    areaBoundsCenterMarker
      .closePopup()
      .unbindPopup();

    map.removeLayer(areaBoundsCenterMarker);
  };

  // When they've confirmed their guess, compute and draw result
  const onChosenPointConfirmed = async () => {
    /* First, compute the distance / score */

    const chosenLatLng = chosenPointMarker.getLatLng();

    await waitForAnyOngoingZoomsToEnd();

    // This is used to compute the distance but we'll also use it to visualize the distance
    const { distance, latLng: nearestPointOnStreet } = await getNearestPointOnPolyLine(
      map,
      chosenLatLng,
      $currentQuestion.target.points as Question["target"]["points"],
    );

    let score = 0;
    if(distance < 1) {
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
      const result: Round = {
        ...value,
        questions: value.questions.map((question) => {
          if(question === $currentQuestion) {
            return {
              ...question,
              ...currentQuestionUpdates,
            }
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
      shouldDrawCircle: true
    });

    if(distance > 0) {
      const distancePolyline = leaflet.polyline(
        [
          chosenLatLng,
          nearestPointOnStreet,
        ],
        {
          color: "black",
          dashArray: "10 10",
          weight: 1,
        }
      ).addTo(resultFeatureGroup);
      distancePolyline.bringToFront();
    }

    targetLayer.bringToFront();

    /* Zoom in on result and reveal street names */

    showElementLabels();
    await delay(100);
    if(!resultFeatureGroup) {
      return;
    }

    map.fitBounds(resultFeatureGroup.getBounds().pad(0.2));
  }

  const onMapClick = (e) => {
    const latLng = {
      ...e.latlng,
      lng: capLng(e.latlng.lng),
    };

    // They're selecting an area
    if(!$isAreaConfirmed) {
      const updateCenter = () => areaCenter.set(reduceLatLngPrecision(latLng));

      // If they came in with a seed and then change the area, warn them
      if(!$round && $gotInitialSeedFromUrl && !hasShownPredefinedAreaChangedWarning) {
        hasShownPredefinedAreaChangedWarning = true;
        trackEvent({ name: "change-prefined-area-seed_attempted", title: "Change predefined area-seed: attempted" });
        if(confirm("The link you opened contains a pre-defined area and set of streets. A friend may have given you the URL so you could compete. \n\nChange the area anyway?")) {
          trackEvent({ name: "change-prefined-area-seed_confirmed", title: "Change predefined area-seed: confirmed" });
          updateCenter();
        }
        else {
          trackEvent({ name: "change-prefined-area-seed_cancelled", title: "Change predefined area-seed: cancelled" });
        }
      }
      else {
        updateCenter();
      }
      return;
    }

    // They're marking their guess
    if(!$isChosenPointConfirmed) {
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
      position: 'topright',
      zoomInText: "&#43;" + (viewportWidth > 800 ? "&emsp;Zoom in" : ""),
      zoomOutText: "&minus;" + (viewportWidth > 800 ? "&emsp;Zoom out" : ""),
    });

    map = leaflet.map(mapElement, initialMapOptions)
      .on('click', onMapClick)
      .on('zoomend', () => {
        /*
          I wish we could we track each zoomstart event and wait for an equal
          number zoomend events, but I've seen this happen:
          1. zoomstart
          2. zoomstart
          3. zoomend
        */
        ongoingZoomCount.set(0);
      })
      .on('zoomstart', () => {
        ongoingZoomCount.update((currentZoomCount) => currentZoomCount + 1);
      })
      .fitBounds(leaflet.latLng($areaCenter).toBounds($areaRadius).pad(getBoundsPaddingWhenMarkingBounds()))
      .addControl(zoomControl);

    locateControl.add(map);

    map.attributionControl.setPrefix("");

    // Let leaflet know when the map container changes size (e.g. when the context-panel grows)
    // @ts-ignore
    if(window.ResizeObserver !== undefined) {
      // @ts-ignore
      new ResizeObserver(
        debounce(() => {
          if(map) {
            map.invalidateSize();
          }
        }, 200, { leading: true })
      ).observe(mapElement);
    }
  };

  // Remove polylines, markers, etc. from map. Used when moving to a new street, etc.
  const resetMap = (shouldFitBounds = true, shouldShowStreets = false) => {
    if(shouldShowStreets) {
      showElementLabels();
    } else {
      hideElementLabels();
    }

    if(resultFeatureGroup) {
      map.removeLayer(resultFeatureGroup);
      resultFeatureGroup = null;
    }
    if(shouldFitBounds) {
        map.fitBounds($areaBounds)
        .once("zoomend", () => {
          // This prevents the map going (and staying gray) on Firefox for Android sometimes
          map.panBy([1, 1]);
        });
    }
  };

  // Draw all streets on the map, etc.
  const showSummary = debounce(() => {
    chosenPoint.set(null);
    resetMap(false, true);

    resultFeatureGroup = leaflet.featureGroup().addTo(map);

    $round.questions.forEach((question) => {
      const { targetLayer } = drawTarget({ color: "#ff2882", layer: resultFeatureGroup, question, });
      const tooltipContentElement = document.createElement("span");
      tooltipContentElement.classList.add("summary-street-tooltip");
      tooltipContentElement.classList.add("single-line-text-overflow");
      tooltipContentElement.innerText = `${question.target.name}`;
      if(question.target.alternativeName) {
        tooltipContentElement.innerText += ` (${question.target.alternativeName})`;
      }

      targetLayer.bindTooltip(tooltipContentElement, {
        direction: "top",
        permanent: true,
        // Accommodate larger font-size
        offset: leaflet.point(0, getViewportWidth() >= 800 ? -15 : -10),
        opacity: 0.7,
      }).openTooltip();
    });

    map.fitBounds(resultFeatureGroup.getBounds().pad(0.1));
  }, 50);

  onMount(() => {
    initializeMap();

    /* The following are store subscriptions, i.e. reactions to state changes */

    // Mark the area bounds whenever the center point changes
    areaCenter.subscribe((value) => {
      if(!value) {
        return;
      }

      // If it hasn't changed, add a little animation as some feedback for the locate button press
      const currrentMapCenterLatLng = map.getCenter();
      const numberOfDecimalPointsToConsider = 4;
      const hasChanged = roundNumber(currrentMapCenterLatLng.lat, numberOfDecimalPointsToConsider) !== roundNumber(value.lat, numberOfDecimalPointsToConsider) ||
        roundNumber(currrentMapCenterLatLng.lng, numberOfDecimalPointsToConsider) !== roundNumber(value.lng, numberOfDecimalPointsToConsider);

      if(!hasChanged) {
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
      if(!value) {
        return;
      }

      markBounds(areaBoundsCircle ? {} : areaSelectionMarkBoundsOptions);
    });

    // Mark their guess
    chosenPoint.subscribe((value) => {
      if(chosenPointMarker) {
        map.removeLayer(chosenPointMarker);
        chosenPointMarker = null;
      }

      if(!value) {
        return;
      }

      chosenPointMarker = leaflet.marker(value).addTo(map);

      // Zoom in a litle to help them see how close they really are
      const currentZoom = map.getZoom();
      const minDesiredZoom = 17;
      if(currentZoom < 18) {
        // Keep the new zoom within the max and min zoom levels we'd like
        let newZoom = Math.max(
          Math.min(currentZoom + 3, maxMapZoom),
          minDesiredZoom,
        );
        setTimeout(() => {
          map.flyTo(chosenPointMarker.getLatLng(), newZoom, { animate: true, duration: 0.5 });
        }, 250);
      }
    });

    // When they confirm their guess, or when it's reset when moving to another street / round
    isChosenPointConfirmed.subscribe((isConfirmed) => {
      if(isConfirmed) {
        onChosenPointConfirmed();
        return;
      }

      // Moved onto new street / challenge. Reset the map to be safe
      if($isAreaConfirmed) {
        resetMap();
      }
    });

    // React to the area being confirmed / unset
    isAreaConfirmed.subscribe((isConfirmed) => {
      // They've chosen to start a new round, back to area selection
      if(!isConfirmed) {
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
    isSummaryShown.subscribe((value) => {
      if(value) {
        showSummary();
      }
      else if($isAreaConfirmed) {
        // Reset the map to be safe
        resetMap(true, true);
      }
    });

    // When we move to the next question, reset the map
    currentQuestionIndex.subscribe((value) => {
      if(value) {
        resetMap();
      }
    });
  });

  const closeSettingsForSmallDevices = () => {
    if (innerWidth <= 1100) {
      areSettingsShown.update((previous) => !previous);
    }
  };
</script>

<div on:click={closeSettingsForSmallDevices} bind:this={mapElement} id="map" />

<style>
  #map {
    height: 100%;
    flex: 1;
    grid-area: map;
  }
</style>
