import { get } from "svelte/store";
import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";
import { filesCache } from "$lib/stores";

export const load = (async (e) => {
  if (get(filesCache)) return { files: [] };
  return {
    files: await trpc(e).fetchAll.query({ token: e.params.token })
  };
}) satisfies PageLoad;
