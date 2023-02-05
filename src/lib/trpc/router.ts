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
  fetchOne: t.procedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    return await redis.getBuffer(input.key + "F");
  }),
  fetchAll: t.procedure.query(async () => {
    const keys = await redis.scan(0, "TYPE", "hash");
    if (keys[1].length == 0) return [];
    let files: [string, Record<string, string>][] = [];
    for (let i = 0; i < keys[1].length; i++) {
      files.push([keys[1][i], await redis.hgetall(keys[1][i])]);
    }
    return files;
  })
});

export type Router = typeof router;
