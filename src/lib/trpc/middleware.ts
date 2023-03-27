import { TRPCError } from "@trpc/server";
import { t } from "./t";
import { MAX_REQUESTS, TIME_PERIOD } from "$lib/constants";
import { ipRequests } from "$lib/stores";

export const ratelimit = t.middleware(async ({ ctx, next }) => {
  const ipReq = ipRequests[ctx.ip];
  if (ipReq && ipReq.count >= MAX_REQUESTS && Date.now() - ipReq.time <= TIME_PERIOD) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }
  // Reset client request count if rate limit time is over
  if (ipReq && Date.now() - ipReq.time >= TIME_PERIOD) {
    delete ipRequests[ctx.ip];
  }
  // Increment the request count for the client IP and update the last request timestamp
  ipRequests[ctx.ip] = {
    count: (ipRequests[ctx.ip]?.count || 0) + 1,
    time: Date.now()
  };

  return next();
});
