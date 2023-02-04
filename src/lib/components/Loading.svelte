<script lang="ts">
  import { fade } from "svelte/transition";
  import { loading, duration } from "$lib/stores";
</script>

{#if $loading}
  <div class="w-full center top">
    <img src="/sync.svg" alt="Sync" class="animate-spin w-10 h-10" transition:fade={{ duration }} />
  </div>
{/if}
