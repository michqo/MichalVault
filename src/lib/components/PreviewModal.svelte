<script lang="ts">
  import { fade } from "svelte/transition";
  import { createEventDispatcher, onMount } from "svelte";
  import { duration, buttonClass } from "$lib/constants";
  import Open from "$lib/svgs/Open.svelte";

  const dispatch = createEventDispatcher();
  const decoder = new TextDecoder();

  const modalClass =
    "fixed center justify-between z-30 my-5 w-full md:max-w-4xl max-h-screen md:max-h-[95%] gap-y-3 md:gap-y-20 px-10 py-5 bg-gray-900 md:border md:border-slate-600 rounded drop-shadow-xl";
  export let file: ["txt" | "img", string, ArrayBuffer?];
  export let name: string;

  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key == "Escape") close();
    });
  });

  function close() {
    dispatch("close");
  }
</script>

<div
  class="fixed z-20 inset-0 w-full min-h-full grid place-items-center"
  transition:fade={{ duration }}
>
  <button class="cursor-default fixed z-20 inset-0 w-full h-full bg-black/[.2]" on:click={close} />
  <div class={modalClass}>
    <div class="center md:flex-row gap-x-4">
      <h1 class="text-center text-xl font-medium tracking-wider">{name}</h1>
      <a target="_blank" rel="noreferrer" href={file[1]}>
        <Open class="w-7 h-7" />
      </a>
    </div>
    {#if file[0] == "img"}
      <img src={file[1]} alt="Modal img" />
    {:else}
      <code
        class="p-5 whitespace-pre-line bg-gray-800 rounded-md overflow-auto max-w-full max-h-full"
        >{decoder.decode(file[2])}</code
      >
    {/if}
    <button class={buttonClass} on:click={close}>Close</button>
  </div>
</div>
