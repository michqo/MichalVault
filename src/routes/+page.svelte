<script lang="ts">
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { files, filesVisible } from "$lib/stores";
  import Upload from "$lib/components/Upload.svelte";
  import FileExplorer from "$lib/components/FileExplorer.svelte";

  const buttonClass =
    "mt-10 text-lg px-3 py-2 rounded-md text-slate-100 bg-white/[.06] border border-slate-300 focus:ring";

  const toggleFiles = async () => {
    $files = await trpc($page).fetchAll.query();
    $filesVisible = true;
  };
</script>

<main class="flex justify-center min-h-screen w-full">
  <div class="center justify-center w-full max-w-md">
    {#if !$filesVisible}
      <Upload />
      <button on:click={toggleFiles} class={buttonClass}>Show files</button>
    {:else}
      <FileExplorer />
    {/if}
  </div>
</main>

<style>
  :global(body) {
    @apply bg-gray-900 text-slate-100 mx-4;
  }
</style>
