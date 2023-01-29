import { type Writable, writable } from "svelte/store";

// Set transition duration in ms
const duration = 250;

const files: Writable<[string, Record<string, string>][]> = writable([]);
const filesVisible = writable(false);

export { files, filesVisible, duration };
