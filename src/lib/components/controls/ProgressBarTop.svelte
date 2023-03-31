<script lang="ts">
  import { fade } from "svelte/transition";
  import { duration } from "$lib/constants";

  export let progress: number;
</script>

<div class="fixed top-0 z-20 bg-gray-700 w-full" transition:fade={{ duration }}>
  <div
    class="bg-blue-600 h-1 w-0 ease-in"
    style="width:{progress}%;transition: width 0.3s ease-in;"
  />
</div>
