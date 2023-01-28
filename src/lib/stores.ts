import { type Writable, writable } from "svelte/store";

const files: Writable<[string, Record<string, string>][]> = writable([]);
const filesVisible = writable(false);

export { files, filesVisible };
