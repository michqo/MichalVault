<script lang="ts">
  import { fade } from "svelte/transition";
  import { duration, confirmVisible, confirmData, confirmResult } from "$lib/stores";

  const modalClass =
    "center fixed z-20 px-20 py-5 bg-gray-900 border border-slate-600 rounded drop-shadow-xl";
  const btnClass = "p-1 rounded hover:bg-white/[.1] focus:ring";
  const imgClass = "w-14 h-14";

  function setResult(confirm: boolean) {
    $confirmResult = confirm;
    $confirmVisible = false;
  }
</script>

{#if $confirmVisible}
  <div class="center" transition:fade={{ duration }}>
    <div class="fixed top-0 left-0 w-full h-full z-10 bg-white/[.04]" />
    <div class={modalClass}>
      <h1 class="text-xl font-medium tracking-wider">Confirm {$confirmData[2]}?</h1>
      <div class="flex space-between gap-x-3 px-8 mt-16">
        <button class={btnClass} on:click={() => setResult(false)} title="Cancel"
          ><img src="/close.svg" alt="Back" class={imgClass} /></button
        >
        <button class={btnClass} on:click={() => setResult(true)} title="Confirm"
          ><img src="/done.svg" alt="Delete" class={imgClass} /></button
        >
      </div>
    </div>
  </div>
{/if}
