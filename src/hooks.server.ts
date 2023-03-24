import type { Handle } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { createTRPCHandle } from "trpc-sveltekit";
import { createContext } from "$lib/trpc/context";
import { router } from "$lib/trpc/router";

const MAX_REQUESTS = 100;
const TIME_PERIOD = 30 * 60 * 1000; // 30 minutes

interface IPRequest {
  count: number; // Requests count
  time: number; // Request time
}

let ipRequests: Record<string, IPRequest> = {};

const ratelimiter: Handle = async ({ event, resolve }) => {
  const clientIp = event.getClientAddress();
  // Check if the client IP has exceeded the maximum number of requests within the time period
  const ipReq = ipRequests[clientIp];
  if (ipReq && ipReq.count >= MAX_REQUESTS && Date.now() - ipReq.time <= TIME_PERIOD) {
    throw error(429, "Too many requests");
  }
  // Reset client request count if rate limit time is over
  if (ipReq && Date.now() - ipReq.time >= TIME_PERIOD) {
    delete ipRequests[clientIp];
  }
  // Increment the request count for the client IP and update the last request timestamp
  ipRequests[clientIp] = {
    count: (ipRequests[clientIp]?.count || 0) + 1,
    time: Date.now()
  };

  return await resolve(event);
};

const TRPCHandle: Handle = createTRPCHandle({ router, createContext });

export const handle = sequence(TRPCHandle, ratelimiter);
