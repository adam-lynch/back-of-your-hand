<script lang="ts">
  import { geolocationRequesterStatus } from "./store";
  import setAreaCenterUsingWebGeolocationApi from "./utilities/setAreaCenterUsingWebGeolocationApi";

  const go = async () => {
    geolocationRequesterStatus.update(() => 'prompted');
    // TODO: errors
    await setAreaCenterUsingWebGeolocationApi();
    geolocationRequesterStatus.update(() => null);
  };

  const cancel = async () => {
    geolocationRequesterStatus.update(() => null);
  };
</script>

<div>
  {#if $geolocationRequesterStatus !== null}
    <div id="geolocation-requester">
      {#if $geolocationRequesterStatus === 'pre-prompt'}
      <p>Blah blah</p>
      
      <button
        class="button--primary"
        on:click={go}>Go</button>
      {:else if $geolocationRequesterStatus === 'prompted'}
        <p>Do it</p>
      {/if}
      <button
        class="button--secondary"
        on:click={cancel}>Cancel</button>
    </div>
  {/if}
</div>

<style>
  #geolocation-requester {
    position: fixed;
    inset: 0;
    background: black;
    color: white;
    z-index: 9999999;

    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
  }
</style>