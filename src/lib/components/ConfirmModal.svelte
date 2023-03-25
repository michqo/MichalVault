<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { duration } from "$lib/constants";
  import Close from "$lib/svgs/Close.svelte";
  import Done from "$lib/svgs/Done.svelte";

  const modalClass =
    "center fixed mx-4 px-10 py-5 bg-gray-900 border border-slate-600 rounded-xl drop-shadow-xl";
  const btnClass = "p-1 rounded-md hover:bg-white/[.1]";
  const imgClass = "w-14 h-14";

  export let title: string;

  const dispatch = createEventDispatcher<{ done: boolean }>();

  function setResult(value: boolean) {
    document.body.style.overflow = "visible";
    dispatch("done", value);
  }

  onMount(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", (e) => {
      if (e.key == "Escape") dispatch("done", false);
    });
  });
</script>

<div
  class="fixed z-20 inset-0 w-full min-h-full grid place-items-center"
  transition:fade={{ duration }}
>
  <button class="cursor-default" on:click={() => setResult(false)}>
    <div class="fixed inset-0 w-full h-full bg-black/[.3]" />
  </button>
  <div class={modalClass}>
    <h1 class="text-center text-xl font-medium tracking-wider">Confirm {title}?</h1>
    <div class="flex space-between gap-x-3 mt-10">
      <button class={btnClass} on:click={() => setResult(true)}><Done class={imgClass} /></button>
      <button class={btnClass} on:click={() => setResult(false)}><Close class={imgClass} /></button>
    </div>
  </div>
</div>
