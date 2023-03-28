<script lang="ts">
  import { onMount } from "svelte";
  import { inputFiles, filesInput, showInfoPanel } from "$lib/stores";
  import Header from "$lib/components/Header.svelte";
  import Token from "$lib/components/Token.svelte";
  import Upload from "$lib/components/Upload.svelte";
  import InfoPanel from "$lib/components/InfoPanel.svelte";

  onMount(() => {
    // Persistent files between routes
    if ($inputFiles) $filesInput.files = $inputFiles;
  });
</script>

<svelte:head>
  <title>Web Vault - Upload files</title>
</svelte:head>

{#if $showInfoPanel}
  <InfoPanel />
{/if}

<Header />
<Token />
<Upload />
