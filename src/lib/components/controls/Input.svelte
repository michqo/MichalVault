<script lang="ts">
  export let label: string;
  export let text: string;

  const inputDivClass = "center md:flex-row md:items-stretch gap-2";
  const labelClass = "text-slate-200 block mb-1";
  const inputClass =
    "w-full px-3 py-2 bg-transparent border border-slate-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500/[.8]";
</script>

<div class="w-full">
  <label for="tokenInput" class={labelClass}>{label}</label>
  <div class={inputDivClass}>
    <input type="text" id="TODO" placeholder="Token" bind:value={text} class={inputClass} />
    <div class="flex gap-2 flex-row">
      <slot />
    </div>
  </div>
</div>
