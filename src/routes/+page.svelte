<script lang="ts">
  import { buttonClass, token } from "$lib/stores";
  import Token from "$lib/components/Token.svelte";
  import Upload from "$lib/components/Upload.svelte";
</script>

<svelte:head>
  <title>Web Vault - Upload files</title>
</svelte:head>

<Token />
{#if $token}
  <Upload />
  <a href="/files" class={buttonClass}>Show files</a>
{/if}
