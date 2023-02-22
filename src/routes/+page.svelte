<script lang="ts">
  import { goto } from "$app/navigation";
  import { buttonClass, token } from "$lib/stores";
  import Token from "$lib/components/Token.svelte";
  import Upload from "$lib/components/Upload.svelte";
  import { showError } from "$lib/components/Modal.svelte";
  
  function handleClick() {
    if (!navigator.onLine) {
      showError("No network connection access")
      return;
    }
    goto(`/files/${$token}`);
  }
</script>

<svelte:head>
  <title>Web Vault - Upload files</title>
</svelte:head>

<Token />
{#if $token}
  <Upload />
  <button on:click={handleClick} class={buttonClass}>Show files</button>
{/if}
