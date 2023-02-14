<script lang="ts">
  import { onMount } from "svelte";
  import type { PageServerData } from "./$types";
  import { inputFiles } from "$lib/stores";
  import FileExplorer from "$lib/components/FileExplorer.svelte";

  export let data: PageServerData;

  onMount(() => {
    // @ts-ignore
    $inputFiles = undefined;
  });
</script>

<svelte:head>
  <title>Web Vault - Files Explorer</title>
</svelte:head>

<FileExplorer files={data.files} />
