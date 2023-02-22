<script>
  import "../app.css";
  import "nprogress/nprogress.css";

  import { fade, fly } from "svelte/transition";
  import NProgress from "nprogress";
  import { loading } from "$lib/stores";
  import { navigating } from "$app/stores";
  import Modal from "$lib/components/Modal.svelte";

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

<main class="flex justify-center min-h-screen w-full">
  <Modal />
  <div class="center justify-center w-full max-w-xl">
    <slot />
  </div>
</main>

<style>
  :global(body) {
    @apply bg-gray-900 text-slate-100 mx-4;
  }
</style>
