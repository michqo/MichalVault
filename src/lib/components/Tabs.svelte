<script lang="ts">
  import { page } from "$app/stores";
  import { token } from "$lib/stores";
  import Folder from "$lib/svgs/Folder.svelte";
  import FolderFill from "$lib/svgs/FolderFill.svelte";
  import Upload from "$lib/svgs/Upload.svelte";
  import Settings from "$lib/svgs/Settings.svelte";
  import SettingsFill from "$lib/svgs/SettingsFill.svelte";

  const linkClass = "w-1/2 py-1 text-lg flex justify-center items-center gap-x-2 border-b";
  const activeClass = "border-indigo-100";
  const inactiveClass = "border-slate-600 opacity-70";
  const svgClass = "w-7 h-7";
</script>

<div class="mt-3 flex gap-x-1 w-full max-w-xl">
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
  <a
    class="{linkClass} {$page.url.pathname == '/settings' ? activeClass : inactiveClass}"
    href="/settings"
  >
    {#if $page.url.pathname == "/settings"}
      <SettingsFill class={svgClass} />
    {:else}
      <Settings class={svgClass} />
    {/if}
    Settings
  </a>
</div>
