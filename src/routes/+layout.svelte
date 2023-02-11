<script>
  import "../app.css";

  import NProgress from "nprogress";
  import { loading } from "$lib/stores";

  import "nprogress/nprogress.css";

  NProgress.configure({
    showSpinner: false,
    minimum: 0.16
  });

  $: {
    if ($loading) {
      NProgress.start();
    }
    if (!$loading) {
      NProgress.done();
    }
  }
</script>

<main class="flex justify-center min-h-screen w-full">
  <div class="center justify-center w-full max-w-xl">
    <slot />
  </div>
</main>

<style>
  :global(body) {
    @apply bg-gray-900 text-slate-100 mx-4;
  }
</style>
