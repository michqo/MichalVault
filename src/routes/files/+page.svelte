<script lang="ts">
  import { onMount } from "svelte";
  import { trpc } from "$lib/trpc/client";
  import { page } from "$app/stores";
  import { inputFiles, loading } from "$lib/stores";
  import FileExplorer from "$lib/components/FileExplorer.svelte";

  let files: [string, Record<string, string>][] = [];

  onMount(async () => {
    // @ts-ignore
    $inputFiles = undefined;
    $loading = true;
    files = await trpc($page).fetchAll.query();
    $loading = false;
  });
</script>

<svelte:head>
  <title>Web Vault - Files Explorer</title>
</svelte:head>

<FileExplorer {files} />
