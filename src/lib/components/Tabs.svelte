<script lang="ts">
  import { page } from "$app/stores";
  import { token } from "$lib/stores";
  import Folder from "$lib/svgs/Folder.svelte";
  import FolderFill from "$lib/svgs/FolderFill.svelte";
  import Upload from "$lib/svgs/Upload.svelte";

  const linkClass =
    "w-1/2 py-1 text-lg flex justify-center items-center gap-x-2 border-b hover:bg-gray-800";
  const activeClass = "border-indigo-400";
  const inactiveClass = "border-indigo-900 opacity-80";
  const svgClass = "w-7 h-7";
</script>

<div class="flex gap-x-1 w-full max-w-xl">
  <a class="{linkClass} {$page.url.pathname == '/' ? activeClass : inactiveClass}" href="/"
    ><Upload class={svgClass} /> Upload</a
  >
  <a
    class="{linkClass} {$page.url.pathname.startsWith('/files') ? activeClass : inactiveClass}"
    href="/files/{$token}"
  >
    {#if $page.url.pathname.startsWith("/files")}
      <FolderFill class={svgClass} />
    {:else}
      <Folder class={svgClass} />
    {/if}
    Files
  </a>
</div>
