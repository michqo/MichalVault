<script>
  import "../app.css";
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
