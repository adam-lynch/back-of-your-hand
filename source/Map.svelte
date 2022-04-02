<script lang="ts">
  import leaflet from "leaflet"; 
  import "mapbox-gl-leaflet"; 
  import debounce from "lodash-es/debounce.js"; 
  import { onMount } from 'svelte';
  import { areaBounds, areaCenter, areaRadius, chosenPoint, currentQuestion, currentQuestionIndex, gotInitialSeedFromUrl, interactionVerb, isAreaConfirmed, isChosenPointConfirmed, isSummaryShown, round } from './store';

  import drawStreet from "./utilities/drawStreet";
  import getNearestPointOnPolyLine from "./utilities/getNearestPointOnPolyLine";
  import getViewportWidth from "./utilities/getViewportWidth";
  import reduceLatLngPrecision from "./utilities/reduceLatLngPrecision";
  import type { Question } from "./utilities/types";
  import trackEvent from "./utilities/trackEvent"; 
  import delay from "./utilities/delay";

  const getBoundsPaddingWhenMarkingBounds = () => getViewportWidth() >= 800 ? 0.2 : 0;

  let areaBoundsCircle: leaflet.Circle;
  let areaBoundsCenterMarker: leaflet.Circle;
  // The options passed to markBounds() when starting a new round, i.e. for area selection
  const areaSelectionMarkBoundsOptions = {
    shouldShowAreaBoundsPopup: true,
  };
  let chosenPointMarker: leaflet.Marker;
  let hasShownPredefinedAreaChangedWarning: boolean;
  let map: leaflet.Map;
  let mapElement: HTMLElement;
  let resultFeatureGroup: leaflet.FeatureGroup;
  const getTileLayer = (id: string) => {
    let baseApiUrl;
    let maptilerBaseUrl = 'https://api.maptiler.com';
    // @ts-ignore
    if(isProduction) {
      baseApiUrl = `${window.location.origin}/mapbox`;
      maptilerBaseUrl = `${window.location.origin}/maptiler`;
    }
    const styleUrl = `${maptilerBaseUrl}/maps/${id}/style.json?key=gZ3xPIpoAqBYwurn52Nc&ignore`;
    // @ts-ignore
    return leaflet.mapboxGL({
      baseApiUrl,
      accessToken: "pk.eyJ1IjoiYWRhbWx5bmNoMDEwIiwiYSI6ImNsMG1zaGoyYjA0OW8zYm16cWR6cWUzd2cifQ.Sqpusys9EbyfRjsA7u85aw",
      attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
      style: styleUrl,
    });
  }
  const tileLayers = {
    base: getTileLayer("d5e820e5-567f-41f8-a7ae-4803e4392477"),
    streets: getTileLayer("96a024f1-e71a-48f3-8ea8-9e0744939308"),
  };

  let isStreetsLayerShown = true;

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
      radius: 50,
    }).addTo(map);

    if(shouldShowAreaBoundsPopup) {
      newAreaBoundsCenterMarker.bindPopup(
        `To select a different area, you can zoom out and ${$interactionVerb.toLowerCase()} anywhere on the map`
      );
      newAreaBoundsCenterMarker.openPopup();
    }

    const newAreaBounds = newAreaBoundsCircle.getBounds();
    areaBounds.update(() => newAreaBounds);
    
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

  const hideStreetsLayer = () => {
    if(!isStreetsLayerShown) {
      return;
    }
    map.removeLayer(tileLayers.streets);
    isStreetsLayerShown = false;
  };

  const showStreetsLayer = (): Promise<void> => {
    return new Promise((resolve) => {
      if(isStreetsLayerShown) {
        resolve();
        return;
      }
      tileLayers.streets
        .once("add", () => {
          isStreetsLayerShown = true;
          resolve()
        })
        .addTo(map);
    });
  };

  // I.e. when they've confirmed the area selection
  const onAreaConfirmed = () => {
    hideStreetsLayer();
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
    // This is used to compute the distance but we'll use it to visualize the distance
    const { distance, point: nearestPointOnStreet } = getNearestPointOnPolyLine(
      map,
      chosenLatLng,
      $currentQuestion.street.points as Question["street"]["points"],
    );

    let score = 0;
    if(distance < 1) {
      const massagedDistance = Math.max(distance, 0.015) - 0.015;
      score = Math.floor((1 - massagedDistance) * 100);
    }

    /* Then update the round / question state */

    const currentQuestionUpdates = {
      distance: {
        amount: distance * 1000,
        unit: "metres",
      },
      score,
      status: "complete",
    };
    round.update((value) => {
      const result = {
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

    const { polyline: streetPolyline } = drawStreet({
      layer: resultFeatureGroup,
      question: { ...$currentQuestion, ...currentQuestionUpdates },
      shouldDrawCircle: true
    });
    
    const distancePolyline = leaflet.polyline(
      [
        chosenLatLng,
        map.layerPointToLatLng(nearestPointOnStreet)
      ],
      {
        color: "black",
        dashArray: "10 10",
        weight: 1,
      }
    ).addTo(resultFeatureGroup);

    distancePolyline.bringToFront();
    streetPolyline.bringToFront();

    /* Zoom in on result and reveal street names */

    showStreetsLayer();
    await delay(100);
    if(!resultFeatureGroup) {
      return;
    }

    map.fitBounds(resultFeatureGroup.getBounds().pad(0.2));
  }

  const onMapClick = (e) => {
    // They're selecting an area
    if(!$isAreaConfirmed) {
      const updateCenter = () => areaCenter.update(() => reduceLatLngPrecision(e.latlng));

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
      chosenPoint.update(() => e.latlng);
    }
  };

  const initializeMap = () => {
    leaflet.Icon.Default.prototype.options.imagePath = "/images/leaflet/"; 

    const viewportWidth = getViewportWidth();
    const mapOptions = {
      boxZoom: false,
      center: leaflet.latLng($areaCenter),
      doubleClickZoom: false,
      layers: Object.values(tileLayers),
      // https://github.com/adam-lynch/back-of-your-hand/issues/38#issuecomment-1079887466
      maxZoom: 23,
      zoom: viewportWidth > 800 ? 14 : 13.2,
      zoomControl: false,
      zoomSnap: 0.25,
    };

    map = leaflet.map(mapElement, mapOptions)
      .on('click', onMapClick)
      .addControl(leaflet.control.zoom({
        position: 'topright',
        zoomInText: "&#43;" + (viewportWidth > 800 ? " Zoom in" : ""),
        zoomOutText: "&minus;" + (viewportWidth > 800 ? " Zoom out" : ""),
      }));
      
    // zoom to initial bounds (it doesn't seem possible to calculate this before the map is initialized)
    map.flyToBounds(mapOptions.center.toBounds($areaRadius).pad(getBoundsPaddingWhenMarkingBounds()));
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
      showStreetsLayer();
    }
    else {
      hideStreetsLayer();
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
    chosenPoint.update(() => null);
    resetMap(false, true);

    resultFeatureGroup = leaflet.featureGroup().addTo(map);

    $round.questions.forEach((question) => {
      const { polyline } = drawStreet({ color: "#ff2882", layer: resultFeatureGroup, question, });
      const tooltipContentElement = document.createElement("span");
      tooltipContentElement.classList.add("summary-street-tooltip");
      tooltipContentElement.classList.add("single-line-text-overflow");
      tooltipContentElement.innerText = `${question.street.name}`;
      if(question.street.alternativeName) {
        tooltipContentElement.innerText += ` (${question.street.alternativeName})`;
      }

      polyline.bindTooltip(tooltipContentElement, {
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
      const maxZoom = map.getMaxZoom();
      const minDesiredZoom = 17;
      if(currentZoom < maxZoom - 5) {
        // Keep the new zoom within the max and min zoom levels we'd like
        let newZoom = Math.max(
          Math.min(currentZoom + 3, maxZoom),
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
        map.setMaxBounds(null).setMinZoom(null);
        resetMap(false, true);
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
</script>

<div bind:this={mapElement} id="map"></div>

<style>
  #map {
    height: 100%;
    flex: 1;
    grid-area: map;
  }

  :global(.leaflet-gl-layer.mapboxgl-map) {
    position: absolute;
    inset: 0;
  }
</style>