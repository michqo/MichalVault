<script lang="ts">
  import { tweened } from "svelte/motion";
  import { status } from "$lib/stores";

  export let timeout: number;

  const progress = tweened(100, {
    duration: timeout
  });

  status.subscribe((value) => {
    if (value) {
      progress.set(100, { duration: 0 });
      progress.set(0);
    }
  });
</script>

<div class="bg-gray-700 rounded-t-md h-0.5 w-full max-w-full">
  <div class="bg-blue-500 rounded-tl-md h-0.5 w-0" style="width:{$progress}%" />
</div>
