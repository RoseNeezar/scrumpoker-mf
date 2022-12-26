import express from "express";
import cors from "cors";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { z } from "zod";
import * as trpcExpress from "@trpc/server/adapters/express";
import { prisma } from "@scrumpoker-mf/prisma";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const appRouter = t.router({
  getUser: t.procedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return { hello: "world" };
    }),
  createUser: t.procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: input,
      });
      return user;
    }),
});

export type AppRouter = typeof appRouter;

const PORT = 3001;

const app = express();

app
  .use(cors())
  .use((req, _res, next) => {
    console.log(req.method, req.path, req.body ?? req.query);
    next();
  })
  .use(
    "/trpc",
    trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
  )
  .listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`);
  });
