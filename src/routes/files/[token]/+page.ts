import { TRPCClientError } from "@trpc/client";
import { error } from "@sveltejs/kit";
import { get } from "svelte/store";
import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";
import { filesCache } from "$lib/stores";

export const load = (async (e) => {
  if (get(filesCache)) return { files: [] };
  try {
    return { files: await trpc(e).fetchAll.query({ token: e.params.token }) };
  } catch (e) {
    if (e instanceof TRPCClientError) {
      throw error(429, e.message);
    } else {
      throw error(500);
    }
  }
}) satisfies PageLoad;
