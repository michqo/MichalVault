import { type Writable, writable } from "svelte/store";
import type { IPRequest } from "./constants";

const filesCache: Writable<[string, Date, Record<string, string>[]] | undefined> = writable();
const inputFiles: Writable<FileList> = writable();
const filesInput: Writable<HTMLInputElement> = writable();
const loading = writable(false);
const token = writable("");
const status: Writable<["success" | "error", string] | undefined> = writable();
const showInfoPanel = writable(false);

/**
 * Array of preview files cache
 *
 * @type {[type: "img" | "txt", key: string, url: string, arrayBuffer: ArrayBuffer?]}
 */
const filesPreviewCache: Writable<["img" | "txt", string, string, ArrayBuffer?][]> = writable([]);

/**
 * Object of requests for rate limit
 */
let ipRequests: Record<string, IPRequest> = {};

export {
  filesCache,
  inputFiles,
  filesInput,
  loading,
  token,
  status,
  showInfoPanel,
  filesPreviewCache,
  ipRequests
};
