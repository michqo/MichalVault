import { get } from "svelte/store";
import { page } from "$app/stores";
import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";
export const prerender = true;

export const load = (async ({}) => {
  return {
    files: await trpc(get(page)).fetchAll.query()
  };
}) satisfies PageLoad;
