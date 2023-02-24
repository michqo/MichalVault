<script>
  import "../app.css";
  import "nprogress/nprogress.css";

  import NProgress from "nprogress";
  import { loading } from "$lib/stores";
  import { navigating } from "$app/stores";
  import StatusModal from "$lib/components/StatusModal.svelte";
  import ConfirmModal from "$lib/components/ConfirmModal.svelte";

  NProgress.configure({
    showSpinner: false,
    minimum: 0.16
  });

  $: {
    if ($loading || $navigating) {
      NProgress.start();
    }
    if (!$loading || $navigating) {
      NProgress.done();
    }
  }
</script>

<ConfirmModal />
<main class="center justify-center min-h-screen">
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
