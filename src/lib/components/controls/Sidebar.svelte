<script lang="ts">
  import { fade } from "svelte/transition";
  import { duration } from "$lib/constants";
</script>

<div transition:fade={{ duration }} class="fixed inset-0 w-fit flex items-center">
  <div
    class="flex flex-col gap-y-2 px-3 py-2 bg-white/[.04] border-l-0 border border-slate-700 rounded-r-xl drop-shadow-xl"
  >
    <slot />
  </div>
</div>
