import { type Writable, writable } from "svelte/store";

const animationDuration = 250;

const files: Writable<[string, Record<string, string>][]> = writable([]);
const filesVisible = writable(false);

export { files, filesVisible, animationDuration };
