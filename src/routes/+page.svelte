<script lang="ts">
  import { buttonClass } from "$lib/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Upload from "$lib/components/Upload.svelte";
</script>

<Loading />

<Upload />
<a href="/files" class={buttonClass}>Show files</a>
