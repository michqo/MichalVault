<script lang="ts">
  import { showInfoPanel } from "$lib/stores";
  import Info from "$lib/svgs/Info.svelte";
  import Code from "$lib/svgs/Code.svelte";
</script>

<header class="mt-5 md:mt-20">
  <div class="flex justify-center gap-x-2">
    <a
      class="p-2 rounded-md hover:bg-white/[.1]"
      href="https://github.com/MichalUSER/web_vault"
      target="_blank"
      rel="noreferrer"><Code class="w-10 h-10" /></a
    >
    <button class="p-2 rounded-md hover:bg-white/[.1]" on:click={() => ($showInfoPanel = true)}
      ><Info class="w-10 h-10" /></button
    >
  </div>
  <h1
    class="mt-1 text-indigo-100 text-4xl md:text-5xl text-center font-semibold tracking-wider underline decoration-3"
  >
    Web Vault
  </h1>
  <p class="mt-1 text-center text-slate-300 font-light">File hosting service</p>
</header>
