import { type Writable, writable } from "svelte/store";

const filesCache: Writable<[string, Date, Record<string, string>[]] | undefined> = writable();
const inputFiles: Writable<FileList> = writable();
const filesInput: Writable<HTMLInputElement> = writable();
const loading = writable(false);
const token = writable("");
const success = writable([false, ""]);
const error = writable([false, ""]);

/**
 * Array of preview files cache
 *
 * @type {[type: "img" | "txt", key: string, url: string, text: string?]}
 */
const filesPreviewCache: Writable<["img" | "txt", string, string, string?][]> = writable([]);

export { filesCache, inputFiles, filesInput, loading, token, success, error, filesPreviewCache };
