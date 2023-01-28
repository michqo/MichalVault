<script lang="ts">
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import FileInput from "./FileInput.svelte";

  let uploading = false;
  let error = false;
  let errorMsg = "";

  const handleSubmit = () => {
    uploading = true;
    error = false;
  };
</script>

<form
  method="POST"
  enctype="multipart/form-data"
  class="center gap-y-3 w-full"
  in:fade={{ duration: 250 }}
  use:enhance={({}) => {
    return async ({ result }) => {
      if (result.type == "success") {
        uploading = false;
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
  <div class="fixed top-0 mt-12">
    {#if uploading}
      <img src="/sync.svg" alt="Sync" class="fixed top-0 mt-12 animate-spin w-10 h-10" />
    {:else if error}
      <p class="text-red-400 tracking-wider">Couldn't upload file to server</p>
    {/if}
  </div>
</form>
