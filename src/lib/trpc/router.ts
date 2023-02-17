import { randomBytes } from "node:crypto";
import type { Context } from "$lib/trpc/context";
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import redis from "$lib/redisConn";

export const t = initTRPC.context<Context>().create();

// TODO: Error handling
export const router = t.router({
  // TODO: Improve performance
  deleteAll: t.procedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    const keys = await redis.sscan(input.token, 0);
    let promises: Promise<number>[] = [];
    for (let i = 0; i < keys.length; i++) {
      promises.push(redis.del(keys[1][i]));
    }
    await Promise.all([Promise.allSettled(promises), redis.del(input.token)]);
  }),
  delete: t.procedure
    .input(z.object({ token: z.string(), key: z.string() }))
    .query(async ({ input }) => {
      await Promise.allSettled([
        redis.del([input.key, input.key + "F"]),
        redis.srem(input.token, [input.key, input.key + "F"])
      ]);
    }),
  fetchToken: t.procedure.query(async ({}) => {
    // TODO: Make tokens human readable
    return randomBytes(8).toString("hex");
  }),
  fetchOne: t.procedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    return await redis.getBuffer(input.key + "F");
  }),
  fetchAll: t.procedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    if (input.token.length == 0) return [];
    const keys = await redis.sscan(input.token, 0);
    if (keys[1].length == 0) return [];
    let promises: Promise<Record<string, string>>[] = [];
    let newKeys: string[] = [];
    for (let i = 0; i < keys[1].length; i++) {
      const key = keys[1][i];
      if (key.substring(key.length - 1) == "F") continue;
      promises.push(redis.hgetall(key));
      newKeys.push(key);
    }
    let files: [string, Record<string, string>][] = [];
    const awaitedPromises = await Promise.allSettled(promises);
    for (let i = 0; i < awaitedPromises.length; i++) {
      if (awaitedPromises[i].status == "fulfilled") {
        // @ts-ignore
        files.push([newKeys[i], awaitedPromises[i].value]);
      }
    }
    return files;
  })
});

export type Router = typeof router;
