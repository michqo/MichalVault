<script lang="ts">
  import { buttonClass } from "$lib/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Upload from "$lib/components/Upload.svelte";
</script>

<svelte:head>
  <title>Web Vault - Upload files</title>
</svelte:head>

<Loading />
<Upload />
<a href="/files" class={buttonClass}>Show files</a>
