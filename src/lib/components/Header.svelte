<script lang="ts">
  import { showInfoPanel } from "$lib/stores";
  import Info from "$lib/svgs/Info.svelte";
</script>

<header class="mt-5 md:mt-20 center">
  <button class="mb-2" on:click={() => ($showInfoPanel = true)}><Info class="w-10 h-10" /></button>
  <h1>
    <a
      target="_blank"
      href="https://github.com/MichalUSER/web_vault"
      rel="noreferrer"
      class="text-4xl md:text-5xl text-center font-medium underline decoration-4"
      >Web Vault
    </a>
  </h1>
  <p class="mt-1 text-center text-slate-300 font-light">Anonymous file storage</p>
</header>
