<script lang="ts">
  import Expand from "$lib/svgs/Expand.svelte";

  export let visible: boolean;
  export let label: string;
</script>

<div class="w-full max-w-xs px-3 py-2 rounded-md bg-gray-800">
  <button on:click={() => (visible = !visible)} class="w-full flex items-center justify-between">
    <p class="text-lg font-medium">{label}</p>
    <Expand class="w-7 h-7 transition-transform {visible ? 'rotate-180' : 'rotate-0'}" />
  </button>
  {#if visible}
    <slot />
  {/if}
</div>
