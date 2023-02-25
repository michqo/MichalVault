<script lang="ts" context="module">
  import { success, error } from "$lib/stores";

  const timeout = 4000;

  function setModalTimout() {
    setTimeout(() => {
      success.set(false);
      error.set([false, ""]);
    }, timeout);
  }

  export function showError(text: string) {
    error.set([true, text]);
    setModalTimout();
  }
  export function showSuccess() {
    success.set(true);
    setModalTimout();
  }
</script>

<script lang="ts">
  import { fly } from "svelte/transition";
  import { duration } from "$lib/stores";
  import ProgressBar from "./ProgressBar.svelte";

  const modalClass =
    "center top z-20 bg-gray-900 border border-slate-700 rounded-md drop-shadow-xl";
  const textClass = "tracking-wider mx-2 mt-2 mb-3";
</script>

{#if $success}
  <div class={modalClass} transition:fly={{ y: -50, duration }}>
    <ProgressBar {timeout} />
    <p class="text-green-400 {textClass}">Uploaded file to server</p>
  </div>
{:else if $error[0]}
  <div class={modalClass} transition:fly={{ y: -50, duration }}>
    <ProgressBar {timeout} />
    <p class="text-red-400 {textClass}">{$error[1]}</p>
  </div>
{/if}
