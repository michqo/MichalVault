import redis from "$lib/redisConn";
import type { PageServerLoad } from "./$types";
export const prerender = true;

export const load = (async () => {
  const keys = await redis.scan(0, "TYPE", "hash");
  if (keys[1].length == 0) return [];
  let promises: Promise<Record<string, string>>[] = [];
  for (let i = 0; i < keys[1].length; i++) {
    promises.push(redis.hgetall(keys[1][i]));
  }
  let files: [string, Record<string, string>][] = [];
  const awaitedPromises = await Promise.allSettled(promises);
  for (let i = 0; i < awaitedPromises.length; i++) {
    if (awaitedPromises[i].status == "fulfilled") {
      // @ts-ignore
      files.push([keys[1][i], awaitedPromises[i].value]);
    }
  }

  return { files };
}) satisfies PageServerLoad;
