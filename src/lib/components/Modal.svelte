<script lang="ts" context="module"> 
  import { success, error } from "$lib/stores";

  function setModalTimout() {
    setTimeout(() => {
      success.set(false);
      error.set([false, ""]);
    }, 4000);
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
  import { modalClass, duration } from "$lib/stores";
</script>

{#if $success}
  <div class={modalClass} transition:fly={{ y: -50, duration }}>
    <p class="text-green-400 tracking-wider">Uploaded file to server</p>
  </div>
{:else if $error[0]}
  <div class={modalClass} transition:fly={{ y: -50, duration }}>
    <p class="text-red-400 tracking-wider">{$error[1]}</p>
  </div>
{/if}
