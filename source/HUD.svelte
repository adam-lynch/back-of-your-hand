<script lang="ts">
  import { isLoading } from "./store";
</script>

<div id="hud">
  <div
    class="loading-indicator"
    class:loading-indicator--shown="{$isLoading}">
    <div>
      Loading
      <!-- The following is from https://icons8.com/cssload -->
      <div id="fountainG">
        <div id="fountainG_1" class="fountainG"></div>
        <div id="fountainG_2" class="fountainG"></div>
        <div id="fountainG_3" class="fountainG"></div>
        <div id="fountainG_4" class="fountainG"></div>
        <div id="fountainG_5" class="fountainG"></div>
        <div id="fountainG_6" class="fountainG"></div>
        <div id="fountainG_7" class="fountainG"></div>
        <div id="fountainG_8" class="fountainG"></div>
      </div>
    </div>
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

  /* From https://icons8.com/cssload (modified)*/
  #fountainG{
    position:relative;
    width:240px;
    height:29px;
    margin:auto;
  }

  .fountainG{
    position:absolute;
    top:0;
    background-color: rgba(255,255,255,0.3);
    width:19px;
    height:19px;
    animation-name:bounce_fountainG;
    animation-duration:2.8s;
    animation-iteration-count:infinite;
    animation-direction:normal;
    transform:scale(.5);
    border-radius:19px;
    margin-top: 20px;
  }

  #fountainG_1{
    left:0;
    animation-delay:0.4s;
  }

  #fountainG_2{
    left:30px;
    animation-delay:0.69s;
  }

  #fountainG_3{
    left:60px;
    animation-delay:0.98s;
  }

  #fountainG_4{
    left:90px;
    animation-delay:1.26s;
  }

  #fountainG_5{
    left:120px;
    animation-delay:1.55s;
  }

  #fountainG_6{
    left:150px;
    animation-delay:1.83s;
  }

  #fountainG_7{
    left:180px;
    animation-delay:2.12s;
  }

  #fountainG_8{
    left:210px;
    animation-delay:2.41s;
  }

  @keyframes bounce_fountainG{
    0%{
      transform:scale(1);
      background-color:#fff;
    }

    100%{
      transform:scale(.5);
      background-color:rgba(255,255,255, 0.3);
    }
  }
</style>