import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import redis from "$lib/redisConn";

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const blob = form.get("file_upload") as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uuid = crypto.randomUUID();
    try {
      await redis.hset(uuid, {
        name: blob.name,
        date: new Date().getTime(),
        size: blob.size
      });
      await redis.set(uuid + "F", buffer);
    } catch {
      return fail(500);
    }

    return { success: true };
  }
};
