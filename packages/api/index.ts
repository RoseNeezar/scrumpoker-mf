import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { router } from "./trpc";
import { userRouter } from "./router/user";
import { gameRouter } from "./router/game";
import { createContext } from "./context";
import AuthRoute from "./router/auth-pusher";

const appRouter = router({
  user: userRouter,
  game: gameRouter,
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
  .use("/api/pusher", AuthRoute)
  .use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
  )
  .listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`);
  });
