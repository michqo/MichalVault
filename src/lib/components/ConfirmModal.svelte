<script lang="ts" context="module">
  export function showModal(type: confirmType, text: string, data?: any) {
    confirmData.set([type, text, data]);
    confirmVisible.set(true);
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    duration,
    confirmVisible,
    confirmData,
    confirmResult,
    type confirmType
  } from "$lib/stores";
  import Close from "$lib/svgs/Close.svelte";
  import Done from "$lib/svgs/Done.svelte";

  const modalClass =
    "center fixed mx-4 px-10 py-5 bg-gray-900 border border-slate-600 rounded drop-shadow-xl";
  const btnClass = "p-1 rounded hover:bg-white/[.1]";
  const imgClass = "w-14 h-14";

  function setResult(value: boolean) {
    $confirmResult = value;
    $confirmVisible = false;
    document.body.style.overflow = "visible";
  }

  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key == "Escape" && $confirmVisible) $confirmVisible = false;
    });
  });

  $: if ($confirmVisible) document.body.style.overflow = "hidden";
</script>

{#if $confirmVisible}
  <div
    class="fixed z-20 inset-0 w-full min-h-full grid place-items-center"
    transition:fade={{ duration }}
  >
    <button class="cursor-default" on:click={() => ($confirmVisible = false)}>
      <div class="fixed inset-0 w-full h-full bg-black/[.3]" />
    </button>
    <div class={modalClass}>
      <h1 class="text-center text-xl font-medium tracking-wider">Confirm {$confirmData[1]}?</h1>
      <div class="flex space-between gap-x-3 mt-16">
        <button class={btnClass} on:click={() => setResult(true)}><Done class={imgClass} /></button>
        <button class={btnClass} on:click={() => setResult(false)}
          ><Close class={imgClass} /></button
        >
      </div>
    </div>
  </div>
{/if}
