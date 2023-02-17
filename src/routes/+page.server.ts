import { fail, error } from "@sveltejs/kit";
import type { Actions } from "./$types";
import redis from "$lib/redisConn";
import { maxSize } from "$lib/stores";

// TODO: Put file in the token group
export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const form = await request.formData();
    const files = form.getAll("file_upload") as File[];
    const token = cookies.get("token");
    if (token == undefined) throw error(400);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size == 0) throw error(400);
      if (file.size > maxSize) throw error(400);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uuid = crypto.randomUUID();
        await Promise.all([
          redis.hset(uuid, {
            name: file.name,
            date: new Date().getTime(),
            size: file.size
          }),
          redis.set(uuid + "F", buffer)
        ]);
        await redis.sadd(token, [uuid, uuid + "F"]);
      } catch {
        return fail(500);
      }
    }
    return { success: true };
  }
};
