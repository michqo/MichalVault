<script lang="ts">
  import Cookies from "js-cookie";
  import { fade } from "svelte/transition";
  import { formatBytes } from "../utils";
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

  let progress = 0;
  let uploaded = 0;
  let total = "";

  async function handleSubmit(e: any) {
    if (!navigator.onLine) {
      showError("No network connection access");
      return false;
    } else if (!$inputFiles || $inputFiles.length == 0) {
      showError("No file selected");
      return false;
    } else if (Array.from($inputFiles).reduce((a, b) => a + b.size, 0) > maxSize) {
      showError(`Files cannot be larger than ${maxSizeInMB}MB`);
      return false;
    }
    progress = 0;
    total = formatBytes(Array.from($inputFiles).reduce((a, b) => a + b.size, 0));
    Cookies.set("token", $token, { sameSite: "strict" });

    const xhr = new XMLHttpRequest();
    xhr.upload.onload = () => {
      // TODO
      progress = 0;
    };
    xhr.upload.onerror = () => {
      showError("Failed to upload file to server");
    };
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        uploaded = event.loaded;
        progress = (event.loaded / event.total) * 100;
      }
    };
    // TODO: Fix error
    xhr.open("POST", this.action);
    const data = new FormData(e.target);
    $success = false;
    $error[0] = false;
    // @ts-ignore
    $inputFiles = undefined;
    xhr.send(data);
    // TODO: Error handling
    /*
      return async ({ result }) => {
        if (result.type == "success") {
          showSuccess();
        } else if (result.type == "failure") {
          showError("Internal server error");
        } else if (result.type == "error") {
          showError(result.error.message ? result.error.message : "Failed to upload file to server");
        }
      }
    */
  }

  $: if (progress == 100) showSuccess();
</script>

<form
  method="POST"
  enctype="multipart/form-data"
  class="center gap-y-3 w-full mb-10 mt-5"
  in:fade={{ duration }}
  on:submit|preventDefault={handleSubmit}
>
  {#if progress > 0 && progress < 100}
    <div class="center gap-y-1" transition:fade={{ duration }}>
      <p>{formatBytes(uploaded)} / {total}</p>
      <div class="bg-gray-700 rounded-full drop-shadow h-3 w-72 md:w-96 max-w-full text-center">
        <div
          class="bg-blue-600 rounded-full h-3 w-0 ease-in"
          style="width:{progress}%;transition: width 0.3s ease-in;"
        />
      </div>
    </div>
  {/if}
  <FileInput />
  <button class={buttonClass}>Upload</button>
</form>
