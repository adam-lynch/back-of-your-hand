<!--
  This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
  If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

  Project: Back Of Your Hand (https://backofyourhand.com)
  Repository: https://github.com/adam-lynch/back-of-your-hand
  Copyright © 2024 Adam Lynch (https://adamlynch.com)
-->

<script lang="ts">
  import type * as GeoJSON from "geojson";
  import maplibregl from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import type { LatLng } from "../library/game/types";
  import getMapLibreMapStyle from "../utilities/getMapLibreMapStyle";

  export let centerLatLng: LatLng = { lat: 0, lng: 0 };
  export let isInteractive = true;
  export let markerLatLng: LatLng | null = null;
  export let zoom = 12;

  function toLngLat(latLng: LatLng): [number, number] {
    return [latLng.lng, latLng.lat];
  }

  const dispatch = createEventDispatcher<{
    load: maplibregl.Map;
    click: maplibregl.MapMouseEvent;
  }>();

  let container: HTMLElement;
  let map: maplibregl.Map | undefined;

  export function getMap(): maplibregl.Map | undefined {
    return map;
  }

  $: markerLngLat = markerLatLng ? toLngLat(markerLatLng) : null;

  const markerSourceId = "marker-source";
  const markerLayerId = "marker-layer";
  const markerStrokeLayerId = "marker-stroke-layer";

  function syncMarker() {
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource(markerSourceId) as
      | maplibregl.GeoJSONSource
      | undefined;

    if (!markerLngLat) {
      if (source) {
        source.setData({ type: "FeatureCollection", features: [] });
      }
      return;
    }

    const featureData: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: markerLngLat },
          properties: {},
        },
      ],
    };

    if (source) {
      source.setData(featureData);
    } else {
      map.addSource(markerSourceId, { type: "geojson", data: featureData });

      map.addLayer({
        id: markerStrokeLayerId,
        type: "circle",
        source: markerSourceId,
        paint: {
          "circle-radius": 8,
          "circle-color": "#ff2882",
          "circle-opacity": 1,
        },
      });

      map.addLayer({
        id: markerLayerId,
        type: "circle",
        source: markerSourceId,
        paint: {
          "circle-radius": 5,
          "circle-color": "#ff2882",
          "circle-opacity": 1,
        },
      });
    }
  }

  $: if (map && markerLngLat) {
    syncMarker();
    map.setCenter(markerLngLat);
  } else if (map && !markerLngLat) {
    syncMarker();
  }

  onMount(() => {
    const style = getMapLibreMapStyle();

    map = new maplibregl.Map({
      attributionControl: false,
      center: toLngLat(centerLatLng),
      container,
      interactive: isInteractive,
      style,
      zoom,
    });

    if (isInteractive) {
      map.addControl(new maplibregl.NavigationControl(), "top-right");
    }

    map.on("load", () => {
      dispatch("load", map!);
      syncMarker();
    });

    if (isInteractive) {
      map.on("click", (event) => {
        dispatch("click", event);
      });
    }
  });

  onDestroy(() => {
    map?.remove();
  });
</script>

<div
  bind:this={container}
  class="maplibre-map"
  class:maplibre-map--non-interactive={!isInteractive}
/>

<style>
  .maplibre-map {
    width: 100%;
    height: 100%;
  }

  .maplibre-map--non-interactive {
    cursor: default;
  }
</style>
