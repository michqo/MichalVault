import { randomBytes } from "node:crypto";
import type { Context } from "$lib/trpc/context";
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import redis from "$lib/redisConn";

export const t = initTRPC.context<Context>().create();

// TODO: Error handling
export const router = t.router({
  deleteAll: t.procedure.query(async () => {
    await redis.flushdb();
  }),
  delete: t.procedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    await redis.del(input.key);
    await redis.del(input.key + "F");
  }),
  fetchToken: t.procedure.query(async ({}) => {
    return randomBytes(6).toString("hex");
  }),
  fetchOne: t.procedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    return await redis.getBuffer(input.key + "F");
  }),
  fetchAll: t.procedure.query(async () => {
    const keys = await redis.scan(0, "TYPE", "hash");
    if (keys[1].length == 0) return [];
    let promises: Promise<Record<string, string>>[] = [];
    for (let i = 0; i < keys[1].length; i++) {
      promises.push(redis.hgetall(keys[1][i]));
    }
    let allKeys: [string, Record<string, string>][] = [];
    const awaitedPromises = await Promise.allSettled(promises);
    for (let i = 0; i < awaitedPromises.length; i++) {
      if (awaitedPromises[i].status == "fulfilled") {
        // @ts-ignore
        allKeys.push([keys[1][i], awaitedPromises[i].value]);
      }
    }
    return allKeys;
  })
});

export type Router = typeof router;
