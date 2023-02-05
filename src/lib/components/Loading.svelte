<script lang="ts">
  import { fade } from "svelte/transition";
  import { loading, duration } from "$lib/stores";
</script>

{#if $loading}
  <img
    src="/sync.svg"
    alt="Sync"
    class="animate-spin w-10 h-10 top z-10"
    transition:fade={{ duration }}
  />
{/if}
