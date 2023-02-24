<script lang="ts">
  import Cookies from "js-cookie";
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import {
    buttonClass,
    duration,
    inputFiles,
    maxSize,
    loading,
    token,
    success,
    error,
    maxSizeInMB
  } from "$lib/stores";
  import FileInput from "./FileInput.svelte";
  import { showSuccess, showError } from "./StatusModal.svelte";
</script>

<form
  method="POST"
  enctype="multipart/form-data"
  class="center gap-y-3 w-full mb-10 mt-5"
  in:fade={{ duration }}
  use:enhance={({ cancel }) => {
    if (!navigator.onLine) {
      showError("No network connection access");
      cancel();
      return;
    } else if (!$inputFiles || $inputFiles.length == 0) {
      showError("No file selected");
      cancel();
      return;
    } else if (Array.from($inputFiles).reduce((a, b) => a + b.size, 0) > maxSize) {
      showError(`Files cannot be larger than ${maxSizeInMB}MB`);
      cancel();
      return;
    }
    $success = false;
    $error[0] = false;
    $loading = true;
    // @ts-ignore
    $inputFiles = undefined;
    Cookies.set("token", $token, { sameSite: "strict" });

    return async ({ result }) => {
      $loading = false;
      if (result.type == "success") {
        showSuccess();
      } else if (result.type == "failure") {
        showError("Internal server error");
      } else if (result.type == "error") {
        showError(result.error.message ? result.error.message : "Failed to upload file to server");
      }
    };
  }}
>
  <FileInput />
  <button disabled={$loading} class={buttonClass}>Upload</button>
</form>
