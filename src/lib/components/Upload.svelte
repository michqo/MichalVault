<script lang="ts">
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import { duration } from "$lib/stores";
  import FileInput from "./FileInput.svelte";

  let uploading = false;
  let error = false;
  let success = false;
  let errorMsg = "";

  const handleSubmit = () => {
    success = false;
    uploading = true;
    error = false;
  };
</script>

<div class="center fixed top-0 mt-12">
  {#if uploading}
    <img src="/sync.svg" alt="Sync" class="animate-spin w-10 h-10" transition:fade={{ duration }} />
  {:else if success}
    <p class="text-green-400 tracking-wider" transition:fade={{ duration }}>
      Uploaded file to server
    </p>
  {:else if error}
    <p class="text-red-400 tracking-wider">{errorMsg}</p>
  {/if}
</div>

<form
  method="POST"
  enctype="multipart/form-data"
  class="center gap-y-3 w-full"
  in:fade={{ duration }}
  use:enhance={({}) => {
    return async ({ result }) => {
      if (result.type == "success") {
        uploading = false;
        success = true;
      } else {
        errorMsg = "Couldn't upload file to server";
        error = true;
      }
    };
  }}
>
  <FileInput />
  <button
    disabled={uploading}
    class="text-lg px-3 py-2 rounded-md text-slate-100 bg-white/[.06] border border-slate-300 focus:ring disabled:opacity-75"
    on:click={handleSubmit}>Upload</button
  >
</form>
