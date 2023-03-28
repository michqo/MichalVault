<script lang="ts">
  import { page } from "$app/stores";
  import { token } from "$lib/stores";

  const linkClass = "w-1/2 py-1 text-lg text-center border-b hover:bg-gray-800";
  const activeClass = "border-indigo-400";
  const inactiveClass = "border-indigo-900";
</script>

<div class="flex gap-x-1 w-full max-w-xl">
  <a class="{linkClass} {$page.url.pathname == '/' ? activeClass : inactiveClass}" href="/"
    >Upload</a
  >
  <a
    class="{linkClass} {$page.url.pathname.startsWith('/files') ? activeClass : inactiveClass}"
    href="/files/{$token}">Files</a
  >
</div>
