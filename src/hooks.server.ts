import type { Handle } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { createTRPCHandle } from "trpc-sveltekit";
import { createContext } from "$lib/trpc/context";
import { router } from "$lib/trpc/router";

const MAX_REQUESTS = 5;
const TIME_PERIOD = 30 * 1000;

interface IPRequest {
  count: number; // Requests coint
  time: number; // Request time
}

const ipRequestCounts: Record<string, IPRequest> = {};

const ratelimiter: Handle = async ({ event, resolve }) => {
  const clientIp = event.getClientAddress();
  // Check if the client IP has exceeded the maximum number of requests within the time period
  const ipReq = ipRequestCounts[clientIp];
  if (ipReq && ipReq.count >= MAX_REQUESTS && Date.now() - ipReq.time <= TIME_PERIOD) {
    throw error(429, "Too many requests");
  }
  // Reset client request count if rate limit time is over
  if (ipReq && Date.now() - ipReq.time >= TIME_PERIOD) {
    delete ipRequestCounts[clientIp];
  }
  // Increment the request count for the client IP and update the last request timestamp
  ipRequestCounts[clientIp] = {
    count: (ipRequestCounts[clientIp]?.count || 0) + 1,
    time: Date.now()
  };

  return await resolve(event);
};

const TRPCHandle: Handle = createTRPCHandle({ router, createContext });

export const handle = sequence(TRPCHandle, ratelimiter);
