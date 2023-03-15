<script lang="ts">
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import { TRPCError } from "@trpc/server";
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
  let uploadedCount: number;
  let filesCount: number;
  let uploadingCount: number;
  let progress = 0;
  let totalSize = 0;
  let uploadedSize = 0;
  let uploadedSizes: number[];
  let totalSizes: number[];

  function addFilesToCache() {
    if (!$filesCache) return;
    for (const file of $inputFiles) {
      for (const item of $filesCache[2]) {
        if (file.name == item.name) return;
      }
      $filesCache[2].push({
        key: `${$token}/${file.name}`,
        name: file.name,
        size: file.size.toString(),
        date: new Date().toString()
      });
    }
  }

  function uploadFile(fd: FormData, url: string, file: File, i: number) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 400) {
          showError(CLIENT_ERROR);
          uploading = false;
          return;
        }
        uploadedCount += 1;
      }
    };

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        if (totalSizes[i] == 0) {
          totalSizes[i] = event.total;
          uploadingCount += 1;
        }
        uploadedSizes[i] = event.loaded;
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
    }
    const filesSize = Array.from($inputFiles).reduce((a, b) => a + b.size, 0);
    if (filesSize > maxSize) {
      showError(FILE_SIZE_ERROR);
      return;
    }

    totalSize = 0;
    uploadedCount = 0;
    progress = 0;
    filesCount = $inputFiles.length;
    uploadingCount = 0;
    uploadedSizes = Array(filesCount).fill(0);
    totalSizes = Array(filesCount).fill(0);

    let result: { url: string; fields: Record<string, string> };
    try {
      result = await trpc($page).getUploadUrl.query({ token: $token, filesSize, filesCount });
    } catch (e) {
      if (e instanceof TRPCError) {
        if (e.code == "INTERNAL_SERVER_ERROR") {
          showError(SERVER_ERROR);
        } else {
          showError(e.message);
        }
      } else {
        showError(CLIENT_ERROR);
      }
      return;
    }
    const { url, fields } = result;
    let fd = new FormData();
    for (const key in fields) {
      fd.append(key, fields[key]);
    }

    for (let i = 0; i < $inputFiles.length; i++) {
      // structuredClone is REQUIRED
      uploadFile(structuredClone(fd), url, $inputFiles[i], i);
    }
  }

  // Calculate progress
  $: if (filesCount && uploadingCount == filesCount) uploading = true;
  $: if (uploading) {
    uploadedSize = uploadedSizes.reduce((a, b) => a + b, 0);
    totalSize = totalSizes.reduce((a, b) => a + b, 0);
    progress = (uploadedSize / totalSize) * 100;
  }

  // Successful files upload
  $: {
    if (filesCount && uploadedCount == filesCount) {
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
        <p class="text-sm">{formatBytes(uploadedSize)} / {formatBytes(totalSize)}</p>
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
