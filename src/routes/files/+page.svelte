<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { files, loading, inputFiles } from "$lib/stores";
  import FileExplorer from "$lib/components/FileExplorer.svelte";

  onMount(async () => {
    // @ts-ignore
    $inputFiles = undefined;
    $loading = true;
    $files = await trpc($page).fetchAll.query();
    $loading = false;
  });
</script>

<svelte:head>
  <title>Web Vault - Files Explorer</title>
</svelte:head>

<FileExplorer />
