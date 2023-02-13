<script lang="ts">
  import { inputFiles } from "$lib/stores";
  import { formatBytes } from "$lib/utils";

  let hover = false;
  let fileInput: HTMLInputElement;

  function dropHandler(e: DragEvent) {
    hover = false;
    if (e.dataTransfer) {
      if (!e.dataTransfer.files) return;
      let files = $inputFiles
        ? Array.from($inputFiles).concat(Array.from(e.dataTransfer.files))
        : Array.from(e.dataTransfer.files);
      let dt = new DataTransfer();
      for (let i = 0; i < files.length; i++) {
        dt.items.add(files[i]);
      }
      fileInput.files = dt.files; // Required
      $inputFiles = dt.files;
    }
  }

  function removeFile(file: File) {
    let files = Array.from($inputFiles);
    files.splice(files.indexOf(file), 1);
    // @ts-ignore
    $inputFiles = files;
  }
</script>

{#if $inputFiles}
  {#each Array.from($inputFiles) as file}
    <div class="w-full px-3 py-2 mb-1 flex justify-between rounded-md bg-gray-800">
      <div class="flex items-center">
        <button type="button" on:click={() => removeFile(file)}>
          <img src="/delete.svg" alt="Remove" class="w-6 h-6 mr-1 cursor-pointer" />
        </button>
        <p>{file.name}</p>
      </div>
      <p>{formatBytes(file.size)}</p>
    </div>
  {/each}
{/if}

<div class="w-full">
  <label
    on:drop|preventDefault={() => dropHandler(event)}
    on:dragover|preventDefault={() => (hover = true)}
    on:dragleave={() => (hover = false)}
    class="flex justify-center w-full h-32 px-4 mt-2 transition bg-transparent border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:bg-white/[.03] focus:outline-none {hover
      ? 'bg-white/[.03]'
      : 'bg-transparent'}"
  >
    <span class="flex items-center space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        class="w-7 h-7 {hover ? 'text-green-500' : 'text-inherit'}"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <span class="font-medium">
        Drop files to attach, or
        <span class="text-blue-400 underline">browse</span>
      </span>
    </span>
    <input
      type="file"
      multiple
      name="file_upload"
      bind:this={fileInput}
      bind:files={$inputFiles}
      on:change={() => console.log($inputFiles)}
      class="hidden"
    />
  </label>
</div>
