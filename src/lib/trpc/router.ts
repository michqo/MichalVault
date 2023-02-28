import { z } from "zod";
import { randomBytes } from "node:crypto";
import type { Context } from "$lib/trpc/context";
import { initTRPC } from "@trpc/server";
import redis from "$lib/server/redis";
import randomWords from "random-words";

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  deleteAll: t.procedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    const keys = await redis.sscan(input.token, 0);
    const pipeline = redis.pipeline();
    for (let i = 0; i < keys.length; i++) {
      pipeline.del(keys[1][i]);
    }
    pipeline.del(input.token);
    await pipeline.exec();
  }),
  delete: t.procedure
    .input(z.object({ token: z.string(), key: z.string() }))
    .query(async ({ input }) => {
      const pipeline = redis.pipeline();
      pipeline.del([input.key, input.key + "F"]);
      pipeline.srem(input.token, [input.key, input.key + "F"]);
      await pipeline.exec();
    }),
  fetchToken: t.procedure.query(async ({}) => {
    const words = randomWords({
      exactly: 3,
      maxLength: 4
    });
    return words.join("-");
  }),
  fetchOne: t.procedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    return await redis.getBuffer(input.key + "F");
  }),
  fetchAll: t.procedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    if (input.token.length == 0) return [];
    const keys = await redis.sscan(input.token, 0);
    if (keys[1].length == 0) return [];
    let newKeys: string[] = [];
    const pipeline = redis.pipeline();
    for (let i = 0; i < keys[1].length; i++) {
      const key = keys[1][i];
      if (key.substring(key.length - 1) == "F") continue;
      pipeline.hgetall(key);
      newKeys.push(key);
    }
    // @ts-ignore
    const files: [any, Record<string, string>][] = await pipeline.exec();
    let filesWithKeys: [string, Record<string, string>][] = [];
    for (let i = 0; i < newKeys.length; i++) {
      filesWithKeys.push([newKeys[i], files[i][1]]);
    }
    return filesWithKeys;
  })
});

export type Router = typeof router;
