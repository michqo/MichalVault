<script>
  import "../app.css";

  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import { duration } from "$lib/constants";
  import ProgressIndicator from "$lib/components/ProgressIndicator.svelte";
  import StatusModal from "$lib/components/StatusModal.svelte";
  import Tabs from "$lib/components/Tabs.svelte";
</script>

<main class="center">
  <ProgressIndicator />
  <StatusModal />
  <Tabs />
  {#key $page}
    <div class="center w-full max-w-xl" in:fade={{ duration }}>
      <slot />
    </div>
  {/key}
</main>

<style>
  :global(body) {
    @apply bg-gray-900 text-slate-100 mx-4 mb-4;
  }
</style>
