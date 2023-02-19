<script lang="ts">
  import Cookies from "js-cookie";
  import { enhance } from "$app/forms";
  import { fade, fly } from "svelte/transition";
  import { buttonClass, duration, inputFiles, maxSize, loading, token, maxSizeInMB } from "$lib/stores";
  import FileInput from "./FileInput.svelte";

  const modalClass =
    "center top px-3 py-2 bg-gray-900 border border-slate-700 rounded-md drop-shadow-xl";
  let error = false;
  let success = false;
  let errorMsg = "";

  function setModalTimout() {
    setTimeout(() => {
      success = false;
      error = false;
    }, 4000);
  }

  function showError(text: string) {
    errorMsg = text;
    error = true;
    setModalTimout();
  }
</script>

{#if success}
  <div class={modalClass} transition:fly={{ y: -50, duration }}>
    <p class="text-green-400 tracking-wider">Uploaded file to server</p>
  </div>
{:else if error}
  <div class={modalClass} transition:fly={{ y: -50, duration }}>
    <p class="text-red-400 tracking-wider">{errorMsg}</p>
  </div>
{/if}

<form
  method="POST"
  enctype="multipart/form-data"
  class="center gap-y-3 w-full mb-10"
  in:fade={{ duration }}
  use:enhance={({ cancel }) => {
    if (!$inputFiles) {
      showError("No file selected");
      cancel();
      return;
    } else if (Array.from($inputFiles).reduce((a, b) => a + b.size, 0) > maxSize) {
      showError(`Files cannot be larger than ${maxSizeInMB}MB`);
      cancel();
      return;
    }
    success = false;
    error = false;
    $loading = true;
    // @ts-ignore
    $inputFiles = undefined;
    Cookies.set("token", $token, { sameSite: "strict" });

    return async ({ result }) => {
      $loading = false;
      if (result.type == "success") {
        success = true;
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
