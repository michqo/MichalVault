import { fail, error } from "@sveltejs/kit";
import type { Actions } from "./$types";
import redis from "$lib/redisConn";
import { maxSize } from "$lib/stores";

// TODO: Put file in the token group
export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const form = await request.formData();
    const files = form.getAll("file_upload") as File[];
    console.log(cookies.get("token"));
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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
    }
    return { success: true };
  }
};
