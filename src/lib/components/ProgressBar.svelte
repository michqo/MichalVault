<script lang="ts">
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";

  export let timeout: number;

  const progress = tweened(100, {
    duration: timeout
  });

  onMount(() => {
    progress.set(0);
  });
</script>

<div class="bg-gray-700 rounded-t-md h-0.5 w-full max-w-full">
  <div class="bg-blue-500 rounded-tl-md h-0.5 w-0" style="width:{$progress}%" />
</div>
