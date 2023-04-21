<script lang="ts">
  import { onMount } from "svelte";
  import { inputFiles, filesInput, showInfoPanel, token, newToken } from "$lib/stores";
  import { page } from "$app/stores";
  import Links from "$lib/components/Links.svelte";
  import Upload from "$lib/components/Upload.svelte";
  import InfoPanel from "$lib/components/InfoPanel.svelte";
  import FileCreate from "$lib/components/FileCreate.svelte";
  import { trpc } from "$lib/trpc/client";

  onMount(async () => {
    // Persistent files between routes
    if ($inputFiles) $filesInput.files = $inputFiles;
    // Load token
    const t = localStorage.getItem("token");
    if (t == undefined) {
      $token = await trpc($page).fetchToken.query();
      localStorage.setItem("token", $token);
    } else {
      $token = t;
    }
    $newToken = $token;
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
