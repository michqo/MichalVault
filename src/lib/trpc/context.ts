import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(e: RequestEvent): Promise<{ ip: string }> {
  return { ip: e.getClientAddress() };
}

export type Context = inferAsyncReturnType<typeof createContext>;
