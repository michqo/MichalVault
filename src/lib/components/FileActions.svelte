<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Sidebar from "./controls/Sidebar.svelte";
  import Delete from "$lib/svgs/Delete.svelte";
  import Sync from "$lib/svgs/Sync.svelte";
  import Download from "$lib/svgs/Download.svelte";
  import Link from "$lib/svgs/Link.svelte";
  import Back from "$lib/svgs/Back.svelte";
  import Open from "$lib/svgs/Open.svelte";

  const dispatch = createEventDispatcher();

  export let selectedFileIndex: number;
  export let files: Record<string, any>;

  const btnClass = "p-1 rounded-md hover:bg-white/[.1]";
  const imgClass = "w-12 h-12";
</script>

{#key selectedFileIndex}
  <Sidebar>
    <a class={btnClass} href="/" title="Go back"><Back class={imgClass} /></a>
    <button class={btnClass} title="Refresh" on:click={() => dispatch("refresh")}
      ><Sync class={imgClass} /></button
    >
    {#if selectedFileIndex == -1}
      <button
        class={btnClass}
        title="Delete selected files"
        on:click={() => dispatch("deleteSelected")}><Delete class={imgClass} /></button
      >
    {:else if selectedFileIndex > -1}
      {@const { key, name } = files[selectedFileIndex]}
      <button class={btnClass} title="Download" on:click={() => dispatch("download", key)}
        ><Download class={imgClass} /></button
      >
      <button
        class={btnClass}
        title="Delete selected files"
        on:click={() => dispatch("deleteSelected")}><Delete class={imgClass} /></button
      >
      <button class={btnClass} title="Copy file link" on:click={() => dispatch("copyLink", key)}
        ><Link class={imgClass} /></button
      >
      <button
        class={btnClass}
        title="Open file preview"
        on:click={() => dispatch("preview", { name, key })}><Open class={imgClass} /></button
      >
    {/if}
  </Sidebar>
{/key}
