<script lang="ts">
  import leaflet from "leaflet"; 
  import debounce from "lodash-es/debounce.js"; 
  import { onMount } from 'svelte';
  import { areaBounds, areaCenter, areaRadius, chosenPoint, currentQuestion, currentQuestionIndex, gotInitialSeedFromUrl, interactionVerb, isAreaConfirmed, isChosenPointConfirmed, isSummaryShown, round } from './store';

  import drawStreet from "./utilities/drawStreet";
  import getDistance from "./utilities/getDistance";
  import getNearestPointOnPolyLine from "./utilities/getNearestPointOnPolyLine";
  import getTileLayerUrl from "./utilities/getTileLayerUrl";
  import getViewportWidth from "./utilities/getViewportWidth";
  import reduceLatLngPrecision from "./utilities/reduceLatLngPrecision";
  import roundNumber from "./utilities/roundNumber";
  import type { Question } from "./utilities/types";
  import trackEvent from "./utilities/trackEvent"; 


  let activeTileLayerName = "streets";
  let areaBoundsCircle: leaflet.Circle;
  // The options passed to markBounds() when starting a new round, i.e. for area selection
  const areaSelectionMarkBoundsOptions = {
    shouldShowAreaBoundsPopup: true,
    transformBoundsToZoomTo: (bounds) => {
      return bounds.pad(
        getViewportWidth() >= 800 
        // It seems to ignore anything past two decimal places
        ? roundNumber(1-(6000/$areaRadius), 2)
        : 0
      );
    }
  };
  let chosenPointMarker: leaflet.Marker;
  let hasShownPredefinedAreaChangedWarning: boolean;
  const initialZoom = 14;
  let map: leaflet.Map;
  let mapElement: HTMLElement;
  let resultFeatureGroup: leaflet.FeatureGroup;
  const layerOptions = { 
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  };
  const tileLayers = {
    "no-streets": leaflet.tileLayer(getTileLayerUrl("no-streets"), layerOptions),
    streets: leaflet.tileLayer(getTileLayerUrl("streets"), layerOptions),
  };


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
    transformBoundsToZoomTo = ((bounds) => bounds),
  }: {
    shouldShowAreaBoundsPopup?: boolean;
    transformBoundsToZoomTo?: ((bounds: leaflet.LatLngBounds) => leaflet.LatLngBounds);
  }) => {
    const newAreaBoundsCircle = leaflet.circle($areaCenter, {
      ...areaBoundsCircleSelectionStyle,
      radius: $areaRadius,
    }).addTo(map);

    if(shouldShowAreaBoundsPopup) {
      newAreaBoundsCircle.bindPopup(`${$interactionVerb} anywhere on the map to select a different area`, {
        offset: leaflet.point(0, -$areaRadius/50),
      });
      newAreaBoundsCircle.openPopup();
    }

    const newAreaBounds = newAreaBoundsCircle.getBounds();
    areaBounds.update(() => newAreaBounds);
    
    const boundsToFitInView = transformBoundsToZoomTo(newAreaBoundsCircle.getBounds());
    if(!map.getBounds().contains(boundsToFitInView)) {
      map.fitBounds(boundsToFitInView);
    }
    
    if(areaBoundsCircle) {
      map.removeLayer(areaBoundsCircle);
    }
    areaBoundsCircle = newAreaBoundsCircle;
  };

  // Used for showing / hiding street names
  const changeTileLayer = (newLayerName, oldLayerName) => {
    if(newLayerName === activeTileLayerName) {
      return;
    }
    tileLayers[newLayerName]
      .addTo(map)
      .once("tileload", () => {
        // To be safe (this could be fired later than expected)
        if(activeTileLayerName === newLayerName) {
          tileLayers[newLayerName].bringToFront().on("load", () => {
            // To be safe (this could be fired later than expected)
            if(activeTileLayerName !== oldLayerName) {
              map.removeLayer(tileLayers[oldLayerName]);
            }
          });
        }
      });
    activeTileLayerName = newLayerName;
  }

  // I.e. when they've confirmed the area selection
  const onAreaConfirmed = () => {
    changeTileLayer("no-streets", "streets");
    map.fitBounds($areaBounds)
      .setMaxBounds($areaBounds)
      .setMinZoom(initialZoom - 2);

    areaBoundsCircle
      .setStyle({
        color: "#37003c",
        fill: false,
        stroke: true,
        opacity: 0.4,
      })
      .closePopup()
      .unbindPopup();
  };

  // When they've confirmed their guess, compute and draw result
  const onChosenPointConfirmed = () => {
    /* First, compute the distance / score */

    const chosenLatLng = chosenPointMarker.getLatLng();
    // This is used to compute the distance but we'll use it to visualize the distance
    const nearestPointOnStreet = getNearestPointOnPolyLine(
      chosenLatLng,
      $currentQuestion.street.points as Question["street"]["points"],
    );
    const distance = getDistance(chosenLatLng, nearestPointOnStreet);

    /* Then update the round / question state */

    const currentQuestionUpdates = {
      distance: {
        amount: distance * 1000,
        unit: "metres",
      },
      score: distance > 1 ? 0 : Math.round((1 - distance) * 100),
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
        nearestPointOnStreet
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

    map.fitBounds(resultFeatureGroup.getBounds().pad(0.2));
    changeTileLayer("streets", "no-streets");
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
    map = leaflet.map(mapElement, {
      center: leaflet.latLng($areaCenter),
      layers: [tileLayers[activeTileLayerName]],
      zoom: initialZoom,
      zoomControl: false,
      zoomSnap: 0.25,
    })
      .on('click', onMapClick)
      .addControl(leaflet.control.zoom({
        position: 'topright',
        zoomInText: "&#43;" + (viewportWidth > 800 ? " Zoom in" : ""),
        zoomOutText: "&minus;" + (viewportWidth > 800 ? " Zoom out" : ""),
      }));

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
      changeTileLayer("streets", "no-streets");
    }
    else {
      changeTileLayer("no-streets", "streets");
    }

    if(resultFeatureGroup) {
      map.removeLayer(resultFeatureGroup);
      resultFeatureGroup = null;
    }
    if(shouldFitBounds) {
      map.fitBounds($areaBounds);
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
</style>