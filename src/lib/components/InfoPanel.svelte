<script lang="ts">
  import { fade } from "svelte/transition";
  import { buttonClass, duration } from "$lib/constants";
  import { showInfoPanel } from "$lib/stores";
</script>

<div
  class="fixed flex justify-center w-full inset-0 z-20 bg-black/[.8]"
  transition:fade={{ duration }}
>
  <div class="w-full h-full max-w-3xl center justify-between">
    <div class="text-center mt-5">
      <h1 class="font-medium text-4xl">About</h1>
      <div class="leading-relaxed tracking-wide mt-3">
        <p>Web Vault is a simple file hosting service.</p>
        <p>You can <span class="font-bold">upload, download, delete and browse</span> files.</p>
        <p>Files are stored in their respective vaults.</p>
        <p>A vault is bound to a token.</p>
        <p>Tokens contains of three words separated by dash.</p>
      </div>
    </div>
    <div />
    <button class="{buttonClass} mb-5" on:click={() => ($showInfoPanel = false)}>Close</button>
  </div>
</div>
