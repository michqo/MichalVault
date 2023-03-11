<script lang="ts">
  // @ts-ignore
  import Cookies from "js-cookie";
  import { fade } from "svelte/transition";
  import { deserialize } from "$app/forms";
  import type { ActionResult } from "@sveltejs/kit";
  import { formatBytes } from "../utils";
  import { filesCache, inputFiles, token } from "$lib/stores";
  import {
    buttonClass,
    CLIENT_ERROR,
    duration,
    maxSize,
    FILE_SELECTED_ERROR,
    FILE_SIZE_ERROR,
    NETWORK_ERROR,
    SERVER_ERROR
  } from "$lib/constants";

  import FileInput from "./FileInput.svelte";
  import { showSuccess, showError } from "./StatusModal.svelte";

  let uploading = false;
  let progress = 0;
  let uploaded = 0;
  let total = "";

  function addFilesToCache() {
    if (!$filesCache) return;
    for (const file of $inputFiles) {
      for (const item of $filesCache[1]) {
        if (file.name == item.name) return;
      }
      $filesCache[1].push({
        key: `${$token}/${file.name}`,
        name: file.name,
        size: file.size.toString(),
        date: new Date().toString()
      });
    }
  }

  async function handleSubmit(e: any) {
    if (!navigator.onLine) {
      showError(NETWORK_ERROR);
      return false;
    } else if (!$inputFiles || $inputFiles.length == 0) {
      showError(FILE_SELECTED_ERROR);
      return false;
    } else if (Array.from($inputFiles).reduce((a, b) => a + b.size, 0) > maxSize) {
      showError(FILE_SIZE_ERROR);
      return false;
    }

    progress = 0;
    uploading = true;
    Cookies.set("token", $token, { sameSite: "strict" });

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        // Parse type of string - response to ActionResult
        const result: ActionResult = deserialize(xhr.response);
        switch (result.type) {
          case "success":
            showSuccess();
            addFilesToCache();
            // @ts-ignore
            $inputFiles = undefined;
            break;
          case "failure":
            showError(SERVER_ERROR);
            break;
          case "error":
            showError(result.error.message ? result.error.message : CLIENT_ERROR);
            break;
        }
        uploading = false;
        total = "";
      }
    };

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        if (total.length == 0) total = formatBytes(event.total);
        uploaded = event.loaded;
        progress = (event.loaded / event.total) * 100;
      }
    };

    // @ts-ignore
    xhr.open("POST", this.action);

    const data = new FormData(e.target);

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
    <div class="w-full center gap-y-2" transition:fade={{ duration }}>
      <div class="w-full flex justify-between">
        <p class="text-sm">Uploading</p>
        <p class="text-sm">{formatBytes(uploaded)} / {total}</p>
      </div>
      <div class="bg-gray-700 rounded-full drop-shadow w-full max-w-full text-center">
        <div
          class="bg-blue-600 rounded-full h-1 w-0 ease-in"
          style="width:{progress}%;transition: width 0.3s ease-in;"
        />
      </div>
    </div>
  {/if}
  <FileInput />
  <button class={buttonClass} disabled={$token.length == 0}>Upload</button>
</form>
