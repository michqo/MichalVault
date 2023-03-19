<script lang="ts">
  import { fade } from "svelte/transition";
  import { createEventDispatcher, onMount } from "svelte";
  import { duration, buttonClass } from "$lib/constants";
  import Open from "$lib/svgs/Open.svelte";

  const dispatch = createEventDispatcher();

  const modalClass =
    "center justify-between z-30 w-full h-full md:h-fit md:max-w-4xl fixed gap-y-3 px-10 py-5 bg-gray-900 md:border md:border-slate-600 rounded drop-shadow-xl";
  export let file: ["txt" | "img", string, string?];
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
  <button class="cursor-default fixed z-20 inset-0 w-full h-full bg-black/[.15]" on:click={close} />
  <div class={modalClass}>
    <div class="center md:flex-row justify-center gap-x-2">
      <h1 class="text-center text-xl font-medium tracking-wider mb-2">{name}</h1>
      <a target="_blank" rel="noreferrer" href={file[0] == "img" ? file[1] : file[2]}>
        <Open class="w-7 h-7" />
      </a>
    </div>
    {#if file[0] == "img"}
      <img src={file[1]} alt="Modal img" />
    {:else}
      <code class="overflow-auto max-w-full max-h-full">{file[1]}</code>
    {/if}
    <button class="{buttonClass} mt-10" on:click={close}>Close</button>
  </div>
</div>
