<script lang="ts">
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { formatBytes } from "../utils";
  import { filesCache, inputFiles, filesInput, token } from "$lib/stores";
  import {
    buttonClass,
    duration,
    maxSize,
    FILE_SELECTED_ERROR,
    FILE_SIZE_ERROR,
    NETWORK_ERROR,
    CLIENT_ERROR,
    SERVER_ERROR
  } from "$lib/constants";
  import FileInput from "./FileInput.svelte";
  import { showSuccess, showError } from "./StatusModal.svelte";

  let uploading = false;
  let progress = 0;
  let uploaded = 0;
  let total = "";
  let uploadedCount: number;
  let filesCount: number;

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

  /*
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
  */

  function uploadFile(fd: FormData, url: string, file: File) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 400) {
          // TODO: Fix error handling
          showError(SERVER_ERROR);
          uploading = false;
          return;
        }
        uploadedCount += 1;
      }
    };

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        if (total.length == 0) {
          total = formatBytes(event.total);
          uploading = true;
        }
        uploaded = event.loaded;
        progress = (event.loaded / event.total) * 100;
      }
    };

    fd.append("file", file);
    fd.set("key", `${$token}/${file.name}`);

    xhr.open("POST", url);
    xhr.send(fd);
  }

  async function handleSubmit() {
    if (!navigator.onLine) {
      showError(NETWORK_ERROR);
      return;
    } else if (!$inputFiles || $inputFiles.length == 0) {
      showError(FILE_SELECTED_ERROR);
      return;
    } else if (Array.from($inputFiles).reduce((a, b) => a + b.size, 0) > maxSize) {
      showError(FILE_SIZE_ERROR);
      return;
    }

    progress = 0;
    total = "";
    uploadedCount = 0;
    filesCount = $inputFiles.length;

    const { url, fields } = await trpc($page).getUploadUrl.query({ token: $token });
    let fd = new FormData();
    for (const key in fields) {
      fd.append(key, fields[key]);
    }

    for (const file of $inputFiles) {
      uploadFile(fd, url, file);
    }
  }

  $: {
    if (filesCount && filesCount == uploadedCount) {
      showSuccess();
      addFilesToCache();
      $filesInput.value = "";
      // @ts-ignore
      $inputFiles = undefined;
      uploading = false;
    }
  }
</script>

<form
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
