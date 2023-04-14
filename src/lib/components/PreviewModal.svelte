<script lang="ts">
  import { fade } from "svelte/transition";
  import { createEventDispatcher, onMount } from "svelte";
  import { duration, buttonClass } from "$lib/constants";
  import Open from "$lib/svgs/Open.svelte";

  const dispatch = createEventDispatcher();
  const decoder = new TextDecoder();

  const modalClass =
    "fixed center justify-between z-30 my-5 w-full h-full md:h-fit md:max-w-4xl max-h-screen md:max-h-[95%] gap-y-3 md:gap-y-20 px-10 py-5 bg-gray-900/[.6] backdrop-blur-xl md:border md:border-slate-600 rounded-md drop-shadow-xl";
  export let file: ["txt" | "img", string, ArrayBuffer?];
  export let name: string;

  onMount(() => {
    const funcRef = (e: KeyboardEvent) => {
      if (e.key == "Escape") close();
    };
    document.addEventListener("keydown", funcRef);
    return () => {
      document.removeEventListener("keydown", funcRef);
    };
  });

  function close() {
    dispatch("close");
  }
</script>

<div
  class="fixed z-20 inset-0 w-full min-h-full flex items-center justify-center"
  transition:fade={{ duration }}
>
  <button class="cursor-default fixed z-20 inset-0 w-full h-full bg-black/[.2]" on:click={close} />
  <div class={modalClass}>
    <div class="center md:flex-row gap-2">
      <h1 class="text-center text-xl font-medium tracking-wider">{name}</h1>
      <a target="_blank" rel="noreferrer" href={file[1]}>
        <Open class="pt-1 w-7 h-7" />
      </a>
    </div>
    {#if file[0] == "img"}
      <img src={file[1]} class="overflow-auto" alt="Preview" />
    {:else}
      <code class="p-5 whitespace-pre bg-gray-800 rounded-md overflow-auto max-w-full max-h-full"
        >{decoder.decode(file[2])}</code
      >
    {/if}
    <button class={buttonClass} on:click={close}>Close</button>
  </div>
</div>
