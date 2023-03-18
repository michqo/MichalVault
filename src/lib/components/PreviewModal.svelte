<script lang="ts">
  import { fade } from "svelte/transition";
  import { createEventDispatcher, onMount } from "svelte";
  import { duration, buttonClass } from "$lib/constants";
  import Open from "$lib/svgs/Open.svelte";

  const dispatch = createEventDispatcher();

  const modalClass =
    "center justify-between z-30 w-full overflow-auto h-full max-h-full md:h-fit md:max-w-4xl fixed gap-y-3 px-10 py-5 bg-gray-900 md:border md:border-slate-600 rounded drop-shadow-xl";
  export let fileName: string;
  export let imageSrc: string;
  export let width: number;
  export let height: number;

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
    <div class="w-full">
      <div class="flex items-center justify-center gap-x-2">
        <h1 class="text-center text-xl font-medium tracking-wider mb-2">{fileName}</h1>
        <a target="_blank" rel="noreferrer" href={imageSrc}>
          <Open class="w-7 h-7" />
        </a>
      </div>
      <div class="mx-auto overflow-auto w-fit max-w-full max-h-screen">
        <img src={imageSrc} {width} {height} style="min-width: {width}px;" alt="Modal img" />
      </div>
    </div>
    <button class="{buttonClass} mt-10" on:click={close}>Close</button>
  </div>
</div>
