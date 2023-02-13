import { fail, error } from "@sveltejs/kit";
import type { Actions } from "./$types";
import redis from "$lib/redisConn";
import { maxSize } from "$lib/stores";

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const file = form.get("file_upload") as File;
    if (file.size == 0) throw error(400);
    if (file.size > maxSize) throw error(400);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uuid = crypto.randomUUID();
      await redis.hset(uuid, {
        name: file.name,
        date: new Date().getTime(),
        size: file.size
      });
      await redis.set(uuid + "F", buffer);
    } catch {
      return fail(500);
    }
    return { success: true };
  }
};
