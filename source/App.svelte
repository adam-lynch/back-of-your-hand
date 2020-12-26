<script lang="ts">
  import HUD from "./HUD.svelte";
  import ContextPanel from "./ContextPanel.svelte";
  import FatalErrorDisplay from "./FatalErrorDisplay.svelte";
  import Map from "./Map.svelte";
  import ignoreError from "./utilities/ignoreError";
  import { areaBounds, areaCenter, areaRadius, currentQuestion, deviceBestScore, gotInitialSeedFromUrl, isAreaConfirmed, nextQuestion, round, totalScore } from './store';
  import loadRound from './utilities/loadRound';
  import type { LatLng } from './utilities/types';

  export let unhandledError = null;

  let lastSeenSeed;
  const updateUrl = () => {
    let pathname = `/${$areaCenter.lat},${$areaCenter.lng}`;
    if($round) {
      pathname += `/${$round.seed}`;
    }
    history.replaceState(null, "", window.location.origin + pathname);
    // @ts-ignore
    ignoreError(() => window.goatcounter.count());
  }

  // Update the URL path when the area center changes
  areaCenter.subscribe((value: LatLng) => {
    if(!value) {
      return;
    }
    if(!value.lng)  {
      console.error(typeof value, value)
      throw new Error("areaCenter:setItem, lng doesn't exist");
    }
    updateUrl();
  })

  // Load round of streets once area is confirmed
  isAreaConfirmed.subscribe(async (isConfirmed) => {
    if(!isConfirmed) {
      return;
    }
    
    loadRound({ areaBounds: $areaBounds, areaCenter: $areaCenter, gotInitialSeedFromUrl: $gotInitialSeedFromUrl, radius: $areaRadius });
    ignoreError(() => {
      localStorage.setItem(
        "centerLatLng",
        JSON.stringify($areaCenter)
      );
    });
  });

  // To be safe, complete the round when the final question is complete
  currentQuestion.subscribe((value) => {
    if(value && value.status === "complete" && !$nextQuestion && $round && $round.status !== "complete") {
      round.update((value) => {
        return {
          ...value,
          status: "complete",
        };
      });
    }
  });

  // Do some stuff when the round is updated
  round.subscribe((value) => {
    if(!value){
      return;
    }
    
    if(value.seed !== lastSeenSeed) {
      updateUrl();
      lastSeenSeed = value.seed;
    }
    
    // Once the round ends, see if a new personal best was set
    if(value.status === "complete" && $totalScore > $deviceBestScore) {
      deviceBestScore.update(() => $totalScore);
      round.update((value) => ({
        ...value,
        didSetNewDeviceBestScore: true,
      }))
    }
  });

  // Persist personal best
  deviceBestScore.subscribe((value) => {
    if(!value) {
      return;
    }
    ignoreError(() => localStorage.setItem("deviceBestScore", value.toString()));
  })
</script>

<main>
  {#if unhandledError}
    <FatalErrorDisplay error={unhandledError}/>
  {:else}
    <!-- This is like a sidebar (but not really), I couldn't think of a better name -->
    <ContextPanel />
    <Map />
    <p class="hide-accessibly"><a href="#context-panel">Back to context panel</a></p>
    <HUD />
  {/if}
</main>

<style global>
  /*
    By default, Svelte's template project has a public/global.css and then styles in components
    which get bundled. There's little CSS in this project overall so to avoid an additional
    request, I've moved public/global.css into the top of this root App component's CSS.
    (Other components still have their own scoped styles.)
    By default, Svelte scopes the styles but thanks to the svelte-preprocess rollup plugin,
    we can add the `global` atrribute to the style tag to disable that.
  */

  /*
   * --------------------------------------
   * Leaflet's CSS below, follolwed by ours
   * --------------------------------------
  */
  /* required styles */

  .leaflet-pane,
  .leaflet-tile,
  .leaflet-marker-icon,
  .leaflet-marker-shadow,
  .leaflet-tile-container,
  .leaflet-pane > svg,
  .leaflet-pane > canvas,
  .leaflet-zoom-box,
  .leaflet-image-layer,
  .leaflet-layer {
    position: absolute;
    left: 0;
    top: 0;
    }
  .leaflet-container {
    overflow: hidden;
    }
  .leaflet-tile,
  .leaflet-marker-icon,
  .leaflet-marker-shadow {
    -webkit-user-select: none;
      -moz-user-select: none;
            user-select: none;
      -webkit-user-drag: none;
    }
  /* Prevents IE11 from highlighting tiles in blue */
  .leaflet-tile::selection {
    background: transparent;
  }
  /* Safari renders non-retina tile on retina better with this, but Chrome is worse */
  .leaflet-safari .leaflet-tile {
    image-rendering: -webkit-optimize-contrast;
    }
  /* hack that prevents hw layers "stretching" when loading new tiles */
  .leaflet-safari .leaflet-tile-container {
    width: 1600px;
    height: 1600px;
    -webkit-transform-origin: 0 0;
    }
  .leaflet-marker-icon,
  .leaflet-marker-shadow {
    display: block;
    }
  /* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */
  /* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */
  .leaflet-container .leaflet-overlay-pane svg,
  .leaflet-container .leaflet-marker-pane img,
  .leaflet-container .leaflet-shadow-pane img,
  .leaflet-container .leaflet-tile-pane img,
  .leaflet-container img.leaflet-image-layer,
  .leaflet-container .leaflet-tile {
    max-width: none !important;
    max-height: none !important;
    }

  .leaflet-container.leaflet-touch-zoom {
    -ms-touch-action: pan-x pan-y;
    touch-action: pan-x pan-y;
    }
  .leaflet-container.leaflet-touch-drag {
    -ms-touch-action: pinch-zoom;
    /* Fallback for FF which doesn't support pinch-zoom */
    touch-action: none;
    touch-action: pinch-zoom;
  }
  .leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {
    -ms-touch-action: none;
    touch-action: none;
  }
  .leaflet-container {
    -webkit-tap-highlight-color: transparent;
  }
  .leaflet-container a {
    -webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);
  }
  .leaflet-tile {
    filter: inherit;
    visibility: hidden;
    }
  .leaflet-tile-loaded {
    visibility: inherit;
    }
  .leaflet-zoom-box {
    width: 0;
    height: 0;
    -moz-box-sizing: border-box;
        box-sizing: border-box;
    z-index: 800;
    }
  /* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */
  .leaflet-overlay-pane svg {
    -moz-user-select: none;
    }

  .leaflet-pane         { z-index: 400; }

  .leaflet-tile-pane    { z-index: 200; }
  .leaflet-overlay-pane { z-index: 400; }
  .leaflet-shadow-pane  { z-index: 500; }
  .leaflet-marker-pane  { z-index: 600; }
  .leaflet-tooltip-pane   { z-index: 650; }
  .leaflet-popup-pane   { z-index: 700; }

  .leaflet-map-pane canvas { z-index: 100; }
  .leaflet-map-pane svg    { z-index: 200; }

  .leaflet-vml-shape {
    width: 1px;
    height: 1px;
    }
  .lvml {
    behavior: url(#default#VML);
    display: inline-block;
    position: absolute;
    }


  /* control positioning */

  .leaflet-control {
    position: relative;
    z-index: 800;
    pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
    pointer-events: auto;
    }
  .leaflet-top,
  .leaflet-bottom {
    position: absolute;
    z-index: 1000;
    pointer-events: none;
    }
  .leaflet-top {
    top: 0;
    }
  .leaflet-right {
    right: 0;
    }
  .leaflet-bottom {
    bottom: 0;
    }
  .leaflet-left {
    left: 0;
    }
  .leaflet-control {
    float: left;
    clear: both;
    }
  .leaflet-right .leaflet-control {
    float: right;
    }
  .leaflet-top .leaflet-control {
    margin-top: 10px;
    }
  .leaflet-bottom .leaflet-control {
    margin-bottom: 10px;
    }
  .leaflet-left .leaflet-control {
    margin-left: 10px;
    }
  .leaflet-right .leaflet-control {
    margin-right: 10px;
    }


  /* zoom and fade animations */

  .leaflet-fade-anim .leaflet-tile {
    will-change: opacity;
    }
  .leaflet-fade-anim .leaflet-popup {
    opacity: 0;
    -webkit-transition: opacity 0.2s linear;
      -moz-transition: opacity 0.2s linear;
            transition: opacity 0.2s linear;
    }
  .leaflet-fade-anim .leaflet-map-pane .leaflet-popup {
    opacity: 1;
    }
  .leaflet-zoom-animated {
    -webkit-transform-origin: 0 0;
        -ms-transform-origin: 0 0;
            transform-origin: 0 0;
    }
  .leaflet-zoom-anim .leaflet-zoom-animated {
    will-change: transform;
    }
  .leaflet-zoom-anim .leaflet-zoom-animated {
    -webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);
      -moz-transition:    -moz-transform 0.25s cubic-bezier(0,0,0.25,1);
            transition:         transform 0.25s cubic-bezier(0,0,0.25,1);
    }
  .leaflet-zoom-anim .leaflet-tile,
  .leaflet-pan-anim .leaflet-tile {
    -webkit-transition: none;
      -moz-transition: none;
            transition: none;
    }

  .leaflet-zoom-anim .leaflet-zoom-hide {
    visibility: hidden;
    }


  /* cursors */

  .leaflet-interactive {
    cursor: pointer;
    }
  .leaflet-grab {
    cursor: -webkit-grab;
    cursor:    -moz-grab;
    cursor:         grab;
    }
  .leaflet-crosshair,
  .leaflet-crosshair .leaflet-interactive {
    cursor: crosshair;
    }
  .leaflet-popup-pane,
  .leaflet-control {
    cursor: auto;
    }
  .leaflet-dragging .leaflet-grab,
  .leaflet-dragging .leaflet-grab .leaflet-interactive,
  .leaflet-dragging .leaflet-marker-draggable {
    cursor: move;
    cursor: -webkit-grabbing;
    cursor:    -moz-grabbing;
    cursor:         grabbing;
    }

  /* marker & overlays interactivity */
  .leaflet-marker-icon,
  .leaflet-marker-shadow,
  .leaflet-image-layer,
  .leaflet-pane > svg path,
  .leaflet-tile-container {
    pointer-events: none;
    }

  .leaflet-marker-icon.leaflet-interactive,
  .leaflet-image-layer.leaflet-interactive,
  .leaflet-pane > svg path.leaflet-interactive,
  svg.leaflet-image-layer.leaflet-interactive path {
    pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
    pointer-events: auto;
    }

  /* visual tweaks */

  .leaflet-container {
    background: #ddd;
    outline: 0;
    }
  .leaflet-container a {
    color: #0078A8;
    }
  .leaflet-container a.leaflet-active {
    outline: 2px solid orange;
    }
  .leaflet-zoom-box {
    border: 2px dotted #38f;
    background: rgba(255,255,255,0.5);
    }


  /* general typography */
  .leaflet-container {
    font: 12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif;
    }


  /* general toolbar styles */

  .leaflet-bar {
    box-shadow: 0 1px 5px rgba(0,0,0,0.65);
    border-radius: 4px;
    }
  .leaflet-bar a,
  .leaflet-bar a:hover {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    width: 26px;
    height: 26px;
    line-height: 26px;
    display: block;
    text-align: center;
    text-decoration: none;
    color: black;
    }
  .leaflet-bar a,
  .leaflet-control-layers-toggle {
    background-position: 50% 50%;
    background-repeat: no-repeat;
    display: block;
    }
  .leaflet-bar a:hover {
    background-color: #f4f4f4;
    }
  .leaflet-bar a:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    }
  .leaflet-bar a:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom: none;
    }
  .leaflet-bar a.leaflet-disabled {
    cursor: default;
    background-color: #f4f4f4;
    color: #bbb;
    }

  .leaflet-touch .leaflet-bar a {
    width: 30px;
    height: 30px;
    line-height: 30px;
    }
  .leaflet-touch .leaflet-bar a:first-child {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    }
  .leaflet-touch .leaflet-bar a:last-child {
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    }

  /* zoom control */

  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out {
    font: bold 18px 'Lucida Console', Monaco, monospace;
    text-indent: 1px;
    }

  .leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out  {
    font-size: 22px;
    }


  /* layers control */

  .leaflet-control-layers {
    box-shadow: 0 1px 5px rgba(0,0,0,0.4);
    background: #fff;
    border-radius: 5px;
    }
  .leaflet-control-layers-toggle {
    background-image: url(leaflet/layers.png);
    width: 36px;
    height: 36px;
    }
  .leaflet-retina .leaflet-control-layers-toggle {
    background-image: url(leaflet/layers-2x.png);
    background-size: 26px 26px;
    }
  .leaflet-touch .leaflet-control-layers-toggle {
    width: 44px;
    height: 44px;
    }
  .leaflet-control-layers .leaflet-control-layers-list,
  .leaflet-control-layers-expanded .leaflet-control-layers-toggle {
    display: none;
    }
  .leaflet-control-layers-expanded .leaflet-control-layers-list {
    display: block;
    position: relative;
    }
  .leaflet-control-layers-expanded {
    padding: 6px 10px 6px 6px;
    color: #333;
    background: #fff;
    }
  .leaflet-control-layers-scrollbar {
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 5px;
    }
  .leaflet-control-layers-selector {
    margin-top: 2px;
    position: relative;
    top: 1px;
    }
  .leaflet-control-layers label {
    display: block;
    }
  .leaflet-control-layers-separator {
    height: 0;
    border-top: 1px solid #ddd;
    margin: 5px -10px 5px -6px;
    }

  /* Default icon URLs */
  .leaflet-default-icon-path {
    background-image: url(leaflet/marker-icon.png);
    }


  /* attribution and scale controls */

  .leaflet-container .leaflet-control-attribution {
    background: #fff;
    background: rgba(255, 255, 255, 0.7);
    margin: 0;
    }
  .leaflet-control-attribution,
  .leaflet-control-scale-line {
    padding: 0 5px;
    color: #333;
    }
  .leaflet-control-attribution a {
    text-decoration: none;
    }
  .leaflet-control-attribution a:hover {
    text-decoration: underline;
    }
  .leaflet-container .leaflet-control-attribution,
  .leaflet-container .leaflet-control-scale {
    font-size: 11px;
    }
  .leaflet-left .leaflet-control-scale {
    margin-left: 5px;
    }
  .leaflet-bottom .leaflet-control-scale {
    margin-bottom: 5px;
    }
  .leaflet-control-scale-line {
    border: 2px solid #777;
    border-top: none;
    line-height: 1.1;
    padding: 2px 5px 1px;
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    -moz-box-sizing: border-box;
        box-sizing: border-box;

    background: #fff;
    background: rgba(255, 255, 255, 0.5);
    }
  .leaflet-control-scale-line:not(:first-child) {
    border-top: 2px solid #777;
    border-bottom: none;
    margin-top: -2px;
    }
  .leaflet-control-scale-line:not(:first-child):not(:last-child) {
    border-bottom: 2px solid #777;
    }

  .leaflet-touch .leaflet-control-attribution,
  .leaflet-touch .leaflet-control-layers,
  .leaflet-touch .leaflet-bar {
    box-shadow: none;
    }
  .leaflet-touch .leaflet-control-layers,
  .leaflet-touch .leaflet-bar {
    border: 2px solid rgba(0,0,0,0.2);
    background-clip: padding-box;
    }


  /* popup */

  .leaflet-popup {
    position: absolute;
    text-align: center;
    margin-bottom: 20px;
    }
  .leaflet-popup-content-wrapper {
    padding: 1px;
    text-align: left;
    border-radius: 12px;
    }
  .leaflet-popup-content {
    margin: 13px 19px;
    line-height: 1.4;
    }
  .leaflet-popup-content p {
    margin: 18px 0;
    }
  .leaflet-popup-tip-container {
    width: 40px;
    height: 20px;
    position: absolute;
    left: 50%;
    margin-left: -20px;
    overflow: hidden;
    pointer-events: none;
    }
  .leaflet-popup-tip {
    width: 17px;
    height: 17px;
    padding: 1px;

    margin: -10px auto 0;

    -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
            transform: rotate(45deg);
    }
  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: white;
    color: #333;
    box-shadow: 0 3px 14px rgba(0,0,0,0.4);
    }
  .leaflet-container a.leaflet-popup-close-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px 4px 0 0;
    border: none;
    text-align: center;
    width: 18px;
    height: 14px;
    font: 16px/14px Tahoma, Verdana, sans-serif;
    color: #c3c3c3;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
    }
  .leaflet-container a.leaflet-popup-close-button:hover {
    color: #999;
    }
  .leaflet-popup-scrolled {
    overflow: auto;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    }

  .leaflet-oldie .leaflet-popup-content-wrapper {
    -ms-zoom: 1;
    }
  .leaflet-oldie .leaflet-popup-tip {
    width: 24px;
    margin: 0 auto;

    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";
    filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);
    }
  .leaflet-oldie .leaflet-popup-tip-container {
    margin-top: -1px;
    }

  .leaflet-oldie .leaflet-control-zoom,
  .leaflet-oldie .leaflet-control-layers,
  .leaflet-oldie .leaflet-popup-content-wrapper,
  .leaflet-oldie .leaflet-popup-tip {
    border: 1px solid #999;
    }


  /* div icon */

  .leaflet-div-icon {
    background: #fff;
    border: 1px solid #666;
    }


  /* Tooltip */
  /* Base styles for the element that has a tooltip */
  .leaflet-tooltip {
    position: absolute;
    padding: 6px;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 3px;
    color: #222;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }
  .leaflet-tooltip.leaflet-clickable {
    cursor: pointer;
    pointer-events: auto;
    }
  .leaflet-tooltip-top:before,
  .leaflet-tooltip-bottom:before,
  .leaflet-tooltip-left:before,
  .leaflet-tooltip-right:before {
    position: absolute;
    pointer-events: none;
    border: 6px solid transparent;
    background: transparent;
    content: "";
    }

  /* Directions */

  .leaflet-tooltip-bottom {
    margin-top: 6px;
  }
  .leaflet-tooltip-top {
    margin-top: -6px;
  }
  .leaflet-tooltip-bottom:before,
  .leaflet-tooltip-top:before {
    left: 50%;
    margin-left: -6px;
    }
  .leaflet-tooltip-top:before {
    bottom: 0;
    margin-bottom: -12px;
    border-top-color: #fff;
    }
  .leaflet-tooltip-bottom:before {
    top: 0;
    margin-top: -12px;
    margin-left: -6px;
    border-bottom-color: #fff;
    }
  .leaflet-tooltip-left {
    margin-left: -6px;
  }
  .leaflet-tooltip-right {
    margin-left: 6px;
  }
  .leaflet-tooltip-left:before,
  .leaflet-tooltip-right:before {
    top: 50%;
    margin-top: -6px;
    }
  .leaflet-tooltip-left:before {
    right: 0;
    margin-right: -12px;
    border-left-color: #fff;
    }
  .leaflet-tooltip-right:before {
    left: 0;
    margin-left: -12px;
    border-right-color: #fff;
    }

  /*
   * -------------------------------
   * Leaflet's CSS above, ours below
   * -------------------------------
  */

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* This disables overscroll effects and prevents pull-to-refresh */
    overscroll-behavior-y: none;
    /* Disable zoom on iOS */
    touch-action: none;
  }

  body {
    background: #37003c;
    color: #333;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }

  .leaflet-touch .leaflet-bar a {
    font-size: 1.2rem !important;
    height: auto !important;
    width: auto  !important;
    padding: 2px 10px !important;
    text-align: left !important;
    font-weight: bold !important;
  }


  @media(min-width: 800px) {
    .leaflet-touch .leaflet-bar a {
      padding: 2px 5px !important;
      font-size: 1rem !important;
      font-weight: normal !important;
    }
  }

  .leaflet-control-zoom-in:active,
  .leaflet-control-zoom-in:hover,
  .leaflet-control-zoom-out:active,
  .leaflet-control-zoom-out:hover {
    opacity: 1;
  }

  .leaflet-control-zoom-in.leaflet-disabled,
  .leaflet-control-zoom-out.leaflet-disabled {
    /* Just hide it rather than have an inaccessible colour contrast */
    display: none;
  }

  .leaflet-container a.leaflet-popup-close-button {
    /* For better colour contrast */
    color: #636363;
  }

  .leaflet-tooltip {
    color: black;
    opacity: 0.8 !important;
  }

  .hide-accessibly {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  ol,
  ul {
    list-style: none;
  }

  .single-line-text-overflow {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 2rem;
    font-size: 1.2rem;
    background: #f0f0f0;
    text-shadow: 0 1px 2px white;
    cursor: pointer;
  }

  button:hover,
  button:active {
    background: #d8d8d8;
  }

  button:active {
    position: relative;
    top: 1px;
    text-shadow: 0 0 2px white;
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px #000, 0 0 0 4px rgba(0,0,0,.2);
    transition: box-shadow 0.6s linear;
  }

  .button--primary {
    background: #df206f;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  .button--primary:hover,
  .button--primary:active {
    background: #d11563;
  }

  .button--primary:active {
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
  }

  button:disabled, 
  button:disabled:active, 
  button:disabled:hover {
    background: rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
  }


  button:disabled:active {
    position: relative;
    top: 1px;
  }

  .summary-street-tooltip {
    max-width: 250px;
    display: block;
    color: black;
  }

  @media(min-width: 800px) {
    .summary-street-tooltip {
      font-size: 1.25rem;
    }
  }

  .full-screen-display {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999999;
    
    overflow-y: auto;
    background: white;
  }

  .full-screen-display__inner {
    max-width: 600px;
    margin: 0 auto;
  }

  .full-screen-display__inner > * {
    margin-top: 1.5rem;
  }

  .full-screen-display__innerbutton:first-of-type {
    margin-right: 0.75rem;
  }

  .full-screen-display__inner h2 {
    font-size: 1.2rem;
  }

  .full-screen-display__innerpre {
    padding: 0.5rem;
    overflow: auto;
    background: #f3f3f3;
    font-size: 0.7rem;
  }

  .unstyled-link,
  .unstyled-link:active,
  .unstyled-link:focus,
  .unstyled-link:hover {
    color: inherit;
    cursor: default;
    text-decoration: none;
  }


  /*
   * ---------------------------------------------------------------------------------
   * Our global styles above, App component styles below (note: these are not scoped)
   * ---------------------------------------------------------------------------------
  */

  main {
    height: 100%;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 1fr auto;
    grid-template-areas: 
      "map"
      "context-panel";
    overflow: hidden;
  }

  /* Swap the layout depending on width / aspect-ratio (move context panel to the side) */
  @media (min-width: 1200px),
  (min-aspect-ratio: 1.2/1), /* Browser support is poor for this, so we have to do this: */
  (min-width: 1200px) and (max-height: 912px),
  (min-width: 1150px) and (max-height: 872px),
  (min-width: 1100px) and (max-height: 832px),
  (min-width: 1050px) and (max-height: 792px),
  (min-width: 1000px) and (max-height: 752px),
  (min-width: 950px) and (max-height: 712px),
  (min-width: 900px) and (max-height: 672px),
  (min-width: 850px) and (max-height: 632px),
  (min-width: 800px) and (max-height: 593px),
  (min-width: 750px) and (max-height: 553px),
  (min-width: 700px) and (max-height: 514px),
  (min-width: 650px) and (max-height: 474px),
  (min-width: 600px) and (max-height: 435px),
  (min-width: 550px) and (max-height: 395px),
  (min-width: 500px) and (max-height: 356px),
  (min-width: 450px) and (max-height: 316px),
  (min-width: 400px) and (max-height: 277px),
  (min-width: 350px) and (max-height: 237px),
  (min-width: 300px) and (max-height: 198px) {
    main {
      grid-template-columns: minmax(auto, 33%) 1fr;
      grid-template-rows: auto;
      grid-template-areas: "context-panel map";
    }
  }
</style>