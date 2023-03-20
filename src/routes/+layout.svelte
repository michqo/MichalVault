<script>
  import "../app.css";

  import ProgressIndicator from "$lib/components/ProgressIndicator.svelte";
  import StatusModal from "$lib/components/StatusModal.svelte";
</script>

<main class="center">
  <ProgressIndicator />
  <StatusModal />
  <div class="center w-full max-w-xl mt-5 md:mt-20">
    <slot />
  </div>
</main>

<style>
  :global(body) {
    @apply bg-gray-900 text-slate-100 m-4;
  }
</style>
