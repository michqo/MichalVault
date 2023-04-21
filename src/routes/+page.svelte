<script lang="ts">
  import { onMount } from "svelte";
  import { inputFiles, filesInput, showInfoPanel } from "$lib/stores";
  import Links from "$lib/components/Links.svelte";
  import Upload from "$lib/components/Upload.svelte";
  import InfoPanel from "$lib/components/InfoPanel.svelte";
  import FileCreate from "$lib/components/FileCreate.svelte";

  onMount(() => {
    // Persistent files between routes
    if ($inputFiles) $filesInput.files = $inputFiles;
  });
</script>

<svelte:head>
  <title>MichalVault - Upload files</title>
</svelte:head>

{#if $showInfoPanel}
  <InfoPanel />
{/if}

<Links />
<div class="center w-full h-full justify-center">
  <Upload />
  <FileCreate />
</div>
