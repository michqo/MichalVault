import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";

export const load = (async (e) => {
  return {
    files: await trpc(e).fetchAll.query({ token: e.params.token })
  };
}) satisfies PageLoad;
