import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "@scrumpoker-mf/prisma";

type CreateContextOptions = Record<string, never>;

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    prisma,
  };
};

export const createContext = async (opts: CreateExpressContextOptions) => {
  return await createContextInner({});
};

export type Context = inferAsyncReturnType<typeof createContext>;
