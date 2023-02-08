<script lang="ts">
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import { buttonClass, duration, inputFiles, maxSize, loading } from "$lib/stores";
  import FileInput from "./FileInput.svelte";

  let error = false;
  let success = false;
  let errorMsg = "";
</script>

<div class="center top">
  {#if success}
    <p class="text-green-400 tracking-wider" in:fade={{ duration }}>Uploaded file to server</p>
  {:else if error}
    <p class="text-red-400 tracking-wider" in:fade={{ duration }}>{errorMsg}</p>
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
    $loading = true;
    // @ts-ignore
    $inputFiles = undefined;

    return async ({ result }) => {
      $loading = false;
      if (result.type == "success") {
        success = true;
      } else if (result.type == "failure") {
        errorMsg = "Internal server error";
        error = true;
      } else {
        errorMsg = "Failed to upload file to server";
        error = true;
      }
    };
  }}
>
  <FileInput />
  <button disabled={$loading} class={buttonClass}>Upload</button>
</form>
