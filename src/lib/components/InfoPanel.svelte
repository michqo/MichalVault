<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    duration,
    maxPreviewSize,
    maxSizeInMB,
    maxVaultFilesCount,
    maxVaultSizeinMB
  } from "$lib/constants";
  import { showInfoPanel } from "$lib/stores";
  import { formatBytes } from "$lib/utils";
  import Close from "$lib/svgs/Close.svelte";

  onMount(() => {
    document.body.style.overflow = "hidden";
    const funcRef = (e: KeyboardEvent) => {
      if (e.key == "Escape") $showInfoPanel = false;
    };
    document.addEventListener("keydown", funcRef);
    return () => {
      document.body.style.overflow = "visible";
      document.removeEventListener("keydown", funcRef);
    };
  });
</script>

<div
  class="fixed center w-full inset-0 z-20 overflow-y-auto bg-transparent backdrop-blur-xl"
  transition:fade={{duration}}
>
  <button class="mt-10 p-1 rounded-md hover:bg-white/[.1]" on:click={() => ($showInfoPanel = false)}
    ><Close class="w-12 h-12 text-red-500" /></button
  >
  <div class="w-full h-full max-w-xs md:max-w-3xl center gap-y-3 justify-center text-center">
    <h1 class="font-bold text-5xl tracking-widest">About</h1>
    <div class="leading-relaxed tracking-wide mt-5">
      <p>Web Vault is a simple file hosting service.</p>
      <p>You can <span class="font-medium">upload, download, delete and browse</span> files.</p>
      <p>Files are stored in their respective vaults.</p>
      <p>A vault is bound to a token.</p>
      <p>Tokens are contained of three words separated by a dash.</p>
    </div>
    <div class="flex flex-col gap-y-4">
      <h2 class="font-medium text-3xl mt-5">Instance settings</h2>
      <p>Maximum file upload size: <span class="font-medium">{maxSizeInMB} MB</span></p>
      <p>Maximum vault files size: <span class="font-medium">{maxVaultSizeinMB} MB</span></p>
      <p>Maximum no. of files in vault: <span class="font-medium">{maxVaultFilesCount}</span></p>
      <p>
        Maximum size of file preview: <span class="font-medium">{formatBytes(maxPreviewSize)}</span>
      </p>
    </div>
  </div>
</div>
