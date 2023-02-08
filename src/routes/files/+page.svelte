<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc/client";
  import { files, loading, inputFiles } from "$lib/stores";
  import Loading from "$lib/components/Loading.svelte";
  import FileExplorer from "$lib/components/FileExplorer.svelte";

  onMount(async () => {
    // @ts-ignore
    $inputFiles = undefined;
    $loading = true;
    $files = await trpc($page).fetchAll.query();
    $loading = false;
  });
</script>

<Loading />

<FileExplorer />
