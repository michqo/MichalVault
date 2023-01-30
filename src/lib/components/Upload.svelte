<script lang="ts">
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import { buttonClass, duration, inputFiles, maxSize } from "$lib/stores";
  import FileInput from "./FileInput.svelte";

  let uploading = false;
  let error = false;
  let success = false;
  let errorMsg = "";
</script>

<div class="center fixed top-0 mt-12">
  {#if uploading}
    <img src="/sync.svg" alt="Sync" class="animate-spin w-10 h-10" transition:fade={{ duration }} />
  {:else if success}
    <p class="text-green-400 tracking-wider" transition:fade={{ duration }}>
      Uploaded file to server
    </p>
  {:else if error}
    <p class="text-red-400 tracking-wider" transition:fade={{ duration }}>{errorMsg}</p>
  {/if}
</div>

<form
  method="POST"
  enctype="multipart/form-data"
  class="center gap-y-3 w-full mb-10"
  in:fade={{ duration }}
  use:enhance={({ cancel }) => {
    if (!$inputFiles) {
      errorMsg = "No file selected";
      error = true;
      cancel();
      return;
    } else if ($inputFiles[0].size > maxSize) {
      errorMsg = "File cannot be larger than 20MB";
      error = true;
      cancel();
      return;
    }
    success = false;
    error = false;
    uploading = true;
    // @ts-ignore
    $inputFiles = undefined;

    return async ({ result }) => {
      if (result.type == "success") {
        uploading = false;
        success = true;
      } else if (result.type == "failure") {
        uploading = false;
        errorMsg = "Internal server error";
        error = true;
      } else {
        uploading = false;
        errorMsg = "Failed to upload file to server";
        error = true;
      }
    };
  }}
>
  <FileInput />
  <button disabled={uploading} class={buttonClass}>Upload</button>
</form>
