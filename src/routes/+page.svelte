<script lang="ts">
  import { buttonClass } from "$lib/stores";
  import Upload from "$lib/components/Upload.svelte";
</script>

<svelte:head>
  <title>Web Vault - Upload files</title>
</svelte:head>

<Upload />
<a href="/files" class={buttonClass}>Show files</a>
