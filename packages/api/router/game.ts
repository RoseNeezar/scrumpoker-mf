import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const gameRouter = router({
  createGame: publicProcedure.query(() => {
    return {
      game: "game",
    };
  }),
});
