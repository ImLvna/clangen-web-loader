<script lang="ts">
  import loadingGif from "../assets/loading.gif?url";

  const { gameReady = false } = $props();
</script>

<svelte:head>
  <link rel="preload" href={loadingGif} as="image" />
</svelte:head>
<img
  src={loadingGif}
  id="loadinggif"
  class:hidden={gameReady}
  alt="Loading..."
/>

<style>
  #loadinggif {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    --size: min(50vw, 50vh);
  }
  /* @media (prefers-reduced-motion: reduce) {
        #loadinggif {
            display: none;
        }
    } */
  @media (min-width: 320px) {
    #loadinggif {
      width: var(--size);
      height: var(--size);
    }
  }
  @media (min-width: 768px) {
    #loadinggif {
      width: calc(var(--size) / 2);
      height: calc(var(--size) / 2);
    }
  }
  @media (min-width: 1024px) {
    #loadinggif {
      width: calc(var(--size) / 3);
      height: calc(var(--size) / 3);
    }
  }
</style>
