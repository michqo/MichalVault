<script lang="ts">
  import { fade } from "svelte/transition";
  import { duration, confirmVisible, confirmData, confirmResult } from "$lib/stores";

  const modalClass =
    "center fixed mx-4 px-10 py-5 bg-gray-900 border border-slate-600 rounded drop-shadow-xl";
  const btnClass = "p-1 rounded hover:bg-white/[.1]";
  const imgClass = "w-14 h-14";

  function setResult(confirm: boolean) {
    $confirmResult = confirm;
    $confirmVisible = false;
    document.body.style.overflow = "visible";
  }

  $: if ($confirmVisible) document.body.style.overflow = "hidden";
</script>

{#if $confirmVisible}
  <div
    class="fixed z-20 inset-0 w-full min-h-full grid place-items-center"
    transition:fade={{ duration }}
  >
    <div class="fixed inset-0 w-full h-full bg-black/[.3]" />
    <div class={modalClass}>
      <h1 class="text-center text-xl font-medium tracking-wider">Confirm {$confirmData[2]}?</h1>
      <div class="flex space-between gap-x-3 mt-16">
        <button class={btnClass} on:click={() => setResult(false)}
          ><img src="/close.svg" alt="Back" class={imgClass} /></button
        >
        <button class={btnClass} on:click={() => setResult(true)}
          ><img src="/done.svg" alt="Delete" class={imgClass} /></button
        >
      </div>
    </div>
  </div>
{/if}
