import { fail, error } from "@sveltejs/kit";
import type { Actions } from "./$types";
import redis from "$lib/redisConn";
import { maxSize } from "$lib/stores";

async function fetchFiles(token: string): Promise<[any, Record<string, string>][]> {
  const keys = await redis.sscan(token, 0);
  if (keys[1].length == 0) return [];
  const pipeline = redis.pipeline();
  for (let i = 0; i < keys[1].length; i++) {
    const key = keys[1][i];
    if (key.substring(key.length - 1) == "F") continue;
    pipeline.hgetall(key);
  }
  // @ts-ignore
  return await pipeline.exec();
}

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const form = await request.formData();
    const files = form.getAll("file_upload") as File[];
    const token = cookies.get("token");
    if (token == undefined) throw error(400);
    const filesSize = files.reduce((a, b) => a + b.size, 0);
    if (filesSize > maxSize) throw error(400);
    const vaultFiles = await fetchFiles(token);
    const vaultSize = vaultFiles.reduce((a, b) => a + parseInt(b[1].size), 0);
    if (filesSize + vaultSize > maxSize) throw error(413);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size == 0) throw error(400);
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
