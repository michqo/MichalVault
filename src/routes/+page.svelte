<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { inputFiles, filesInput, token, showInfoPanel } from "$lib/stores";
  import { buttonClass } from "$lib/constants";
  import Header from "$lib/components/Header.svelte";
  import Token from "$lib/components/Token.svelte";
  import Upload from "$lib/components/Upload.svelte";
  import InfoPanel from "$lib/components/InfoPanel.svelte";
  import { showError } from "$lib/components/StatusModal.svelte";
  import Info from "$lib/svgs/Info.svelte";

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

{#if $showInfoPanel}
  <InfoPanel />
{/if}

<button class="fixed top-0 right-0 m-5" on:click={() => ($showInfoPanel = true)}
  ><Info class="w-10 h-10" /></button
>

<Header />
<Token />
<Upload />
<button on:click={handleClick} disabled={$token.length == 0} class={buttonClass}>Show files</button>
