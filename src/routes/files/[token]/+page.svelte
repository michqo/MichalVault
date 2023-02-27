<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { inputFiles } from "$lib/stores";
  import FileExplorer from "$lib/components/FileExplorer.svelte";

  export let data: PageData;

  onMount(async () => {
    // Required because form resets, TODO: Make form not reset
    // @ts-ignore
    $inputFiles = undefined;
  });
</script>

<svelte:head>
  <title>Web Vault - Files Explorer</title>
</svelte:head>

<FileExplorer files={data.files} />
