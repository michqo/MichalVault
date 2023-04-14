<script lang="ts">
  import { fade } from "svelte/transition";
  import { duration } from "$lib/constants";
</script>

<div
  in:fade={{ duration }}
  class="fixed z-10 bottom-0 md:inset-0 h-fit md:w-fit md:h-full flex justify-center md:items-center"
>
  <div
    class="flex flex-row md:flex-col gap-y-2 px-3 py-2 bg-gray-900 border border-b-0 md:border-l-0 md:border-b border-slate-700 rounded-t-md md:rounded-tl-none md:rounded-r-md drop-shadow-xl"
  >
    <slot />
  </div>
</div>
