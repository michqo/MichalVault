<script lang="ts">
  import Done from "$lib/svgs/Done.svelte";

  export let value: string;
  export let checked: boolean;
  export let onChange = () => {};
</script>

<label class="relative select-none">
  <input
    class="appearance-none hidden peer"
    type="checkbox"
    on:change={onChange}
    bind:checked
    {value}
  />
  <Done
    class="rounded-full w-6 h-6 border border-slate-500 text-transparent peer-hover:border-slate-100 peer-checked:text-slate-100 peer-checked:bg-blue-500"
  />
</label>
