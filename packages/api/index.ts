import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { router } from "./trpc";
import { gameRouter } from "./router/game";
import { createContext } from "./context";
import AuthRoute from "./router/auth-pusher";
import { Game, Player } from "@prisma/client";
import bodyParser, { json } from "body-parser";

const appRouter = router({
  game: gameRouter,
});

export type AppRouter = typeof appRouter;
export type GameType = Omit<Game, "created_at" | "updated_at"> & {
  players: Player[];
};
export type PlayerType = Player;

const PORT = 3001;

const app = express();
app.set("trust proxy", true);
app.use(cors());
app
  .use(json({ limit: "50mb" }))
  .use(bodyParser.urlencoded({ extended: false, limit: "50mb" }))
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
