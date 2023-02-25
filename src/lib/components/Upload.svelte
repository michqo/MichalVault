<script lang="ts">
  // @ts-ignore
  import Cookies from "js-cookie";
  import { fade } from "svelte/transition";
  import { deserialize } from "$app/forms";
  import type { ActionResult } from "@sveltejs/kit";
  import { formatBytes } from "../utils";
  import {
    buttonClass,
    duration,
    inputFiles,
    maxSize,
    token,
    success,
    error,
    maxSizeInMB
  } from "$lib/stores";
  import FileInput from "./FileInput.svelte";
  import { showSuccess, showError } from "./StatusModal.svelte";

  let uploading = false;
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
    uploading = true;
    total = formatBytes(Array.from($inputFiles).reduce((a, b) => a + b.size, 0));
    Cookies.set("token", $token, { sameSite: "strict" });

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        // Parse type of string - response to ActionResult
        const result: ActionResult = deserialize(xhr.response);
        switch (result.type) {
          case "success":
            showSuccess();
            break;
          case "failure":
            showError("Internal server error");
            break;
          case "error":
            showError(
              result.error.message ? result.error.message : "Failed to upload file to server"
            );
            break;
        }
        uploading = false;
      }
    };

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        uploaded = event.loaded;
        progress = (event.loaded / event.total) * 100;
      }
    };

    // @ts-ignore
    xhr.open("POST", this.action);

    const data = new FormData(e.target);
    $success = false;
    $error[0] = false;
    // @ts-ignore
    $inputFiles = undefined;

    xhr.send(data);
  }
</script>

<form
  method="POST"
  enctype="multipart/form-data"
  class="center gap-y-3 w-full mb-10 mt-5"
  in:fade={{ duration }}
  on:submit|preventDefault={handleSubmit}
>
  {#if (progress > 0 && progress < 100) || uploading}
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
