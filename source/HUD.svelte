<script lang="ts">
  import { isLoading } from "./store";
</script>

<div id="hud">
  <div
    class="loading-indicator"
    class:loading-indicator--shown="{$isLoading}">
    <span>Loading...</span>
  </div>
</div>

<style>
  #hud {
    position: fixed;
    left: 100%;
    z-index: 9999999;
  }

  .loading-indicator { 
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    font-size: 3.5rem;
    background: rgba(55, 0, 60, 0.8);
    color: white;
    z-index: 9999999;
  }

  @media(min-width: 600px) {
    .loading-indicator {
      font-size: 5rem;
    }
  }

  .loading-indicator--shown { 
    display: block;
  }

  .loading-indicator > * {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>