<script lang="ts">
  import { fade } from "svelte/transition";
  import { navigating } from "$app/stores";
  import { loading } from "$lib/stores";
  import { duration } from "$lib/constants";
</script>

{#if $navigating || $loading}
  <div class="fixed top-0 bg-gray-700 h-1 w-full" transition:fade={{ duration }}>
    <div class="progress bg-blue-500 h-1 w-1/3" />
  </div>
{/if}

<style>
  .progress {
    animation-name: progress;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
  }

  @keyframes progress {
    0% {
      transform: translateX(-50vw);
    }
    100% {
      transform: translateX(100vw);
    }
  }
</style>
