<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    buttonClass,
    duration,
    maxPreviewSize,
    maxSizeInMB,
    maxVaultFilesCount,
    maxVaultSizeinMB
  } from "$lib/constants";
  import { showInfoPanel } from "$lib/stores";
  import { formatBytes } from "$lib/utils";
</script>

<div
  class="fixed flex justify-center w-full inset-0 z-20 bg-gray-900/[.98] overflow-y-auto"
  transition:fade={{ duration }}
>
  <div class="w-full h-full max-w-3xl center gap-y-3 justify-between">
    <div class="text-center mt-10">
      <h1 class="font-bold text-5xl tracking-widest">About</h1>
      <div class="leading-relaxed tracking-wide mt-5">
        <p>Web Vault is a simple file hosting service.</p>
        <p>You can <span class="font-medium">upload, download, delete and browse</span> files.</p>
        <p>Files are stored in their respective vaults.</p>
        <p>A vault is bound to a token.</p>
        <p>Tokens are contained of three words separated by a dash.</p>
      </div>
    </div>
    <div class="flex flex-col gap-y-4">
      <h2 class="font-medium text-3xl mb-2">Instance settings</h2>
      <p>Maximum file upload size: <span class="font-medium">{maxSizeInMB} MB</span></p>
      <p>Maximum vault files size: <span class="font-medium">{maxVaultSizeinMB} MB</span></p>
      <p>Maximum no. of files in vault: <span class="font-medium">{maxVaultFilesCount}</span></p>
      <p>
        Maximum size of file preview: <span class="font-medium">{formatBytes(maxPreviewSize)}</span>
      </p>
    </div>
    <button class="{buttonClass} mb-5" on:click={() => ($showInfoPanel = false)}>Close</button>
  </div>
</div>
