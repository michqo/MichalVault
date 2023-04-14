<script lang="ts">
  import type { PageData } from "./$types";
  import FileExplorer from "$lib/components/FileExplorer.svelte";

  export let data: PageData;
</script>

<svelte:head>
  <title>MichalVault - Files Explorer</title>
</svelte:head>

<FileExplorer files={data.files} />
