<script>
  import "../app.css";

  import ConfirmModal from "$lib/components/ConfirmModal.svelte";
  import StatusModal from "$lib/components/StatusModal.svelte";
  import ProgressIndicator from "$lib/components/ProgressIndicator.svelte";
</script>

<ConfirmModal />
<main class="center justify-center min-h-screen">
  <ProgressIndicator />
  <StatusModal />
  <div class="center justify-center w-full max-w-xl">
    <slot />
  </div>
</main>

<style>
  :global(body) {
    @apply bg-gray-900 text-slate-100 m-4;
  }
</style>
