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
  transition:fade={{ duration }}
>
  <button class="mt-10 p-1 rounded-md hover:bg-white/[.1]" on:click={() => ($showInfoPanel = false)}
    ><Close class="w-12 h-12 text-red-500" /></button
  >
  <div class="w-full h-full max-w-xs md:max-w-3xl center gap-y-3 justify-center text-center">
    <h1 class="font-bold text-5xl tracking-widest">About</h1>
    <div class="leading-relaxed tracking-wide mt-3">
      <p>MichalStore is a simple file hosting service.</p>
      <p>
        Think of it as <span class="font-medium">one drive, google cloud</span> etc, but free and open
        source.
      </p>
    </div>
    <p class="mt-4">
      <span class="font-bold">TIP: </span>Press
      <code class="p-1 bg-gray-800 rounded-md tracking-widest">Ctrl + V</code> to paste image from clipboard
    </p>
    <div class="flex flex-col gap-y-4 mt-8">
      <h2 class="font-medium text-3xl">Instance settings</h2>
      <p>Maximum file upload size: <span class="font-medium">{maxSizeInMB} MB</span></p>
      <p>Maximum vault files size: <span class="font-medium">{maxVaultSizeinMB} MB</span></p>
      <p>Maximum no. of files in vault: <span class="font-medium">{maxVaultFilesCount}</span></p>
      <p>
        Maximum size of file preview: <span class="font-medium">{formatBytes(maxPreviewSize)}</span>
      </p>
    </div>
  </div>
</div>
