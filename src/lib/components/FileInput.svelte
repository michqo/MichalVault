<script lang="ts">
  import { inputFiles } from "$lib/stores";
  import { formatBytes } from "$lib/utils";

  function removeFiles() {
    // @ts-ignore
    $inputFiles = undefined;
  }
</script>

{#if $inputFiles}
  <div class="w-full px-3 py-2 flex justify-between mb-2 rounded-md bg-gray-800">
    <div class="flex items-center">
      <button type="button" on:click={removeFiles}>
        <img src="/delete.svg" alt="Remove" class="w-6 h-6 mr-1 cursor-pointer" />
      </button>
      <p>{$inputFiles[0].name}</p>
    </div>
    <p>{formatBytes($inputFiles[0].size)}</p>
  </div>
{/if}
<div class="w-full">
  <label
    class="flex justify-center w-full h-32 px-4 transition bg-transparent border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:bg-white/[.03] focus:outline-none"
  >
    <span class="flex items-center space-x-2">
      <img src="/upload.svg" alt="Upload" class="w-7 h-7" />
      <span class="font-medium">
        Drop files to attach, or
        <span class="text-blue-400 underline">browse</span>
      </span>
    </span>
    <input type="file" name="file_upload" bind:files={$inputFiles} class="hidden" />
  </label>
</div>
