<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { buttonClass, inputFiles, filesInput, token } from "$lib/stores";
  import Header from "$lib/components/Header.svelte";
  import Token from "$lib/components/Token.svelte";
  import Upload from "$lib/components/Upload.svelte";
  import { showError } from "$lib/components/StatusModal.svelte";

  onMount(() => {
    // Persistent files between routes
    if ($inputFiles) $filesInput.files = $inputFiles;
  });

  function handleClick() {
    if (!navigator.onLine) {
      showError("No network connection access");
      return;
    }
    goto(`/files/${$token}`);
  }
</script>

<svelte:head>
  <title>Web Vault - Upload files</title>
</svelte:head>

<Header />
<Token />
{#if $token}
  <Upload />
  <button on:click={handleClick} class={buttonClass}>Show files</button>
{/if}
