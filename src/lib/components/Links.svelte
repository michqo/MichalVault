<script lang="ts">
  import { showInfoPanel } from "$lib/stores";
  import Info from "$lib/svgs/Info.svelte";
  import Code from "$lib/svgs/Code.svelte";
</script>

<header class="mt-3 flex justify-center gap-x-1 w-full">
  <a
    class="p-2 rounded-md hover:bg-white/[.1]"
    href="https://github.com/MichalUSER/MichalVault"
    target="_blank"
    rel="noreferrer"><Code class="w-10 h-10" /></a
  >
  <button class="p-2 rounded-md hover:bg-white/[.1]" on:click={() => ($showInfoPanel = true)}
    ><Info class="w-10 h-10" /></button
  >
</header>
