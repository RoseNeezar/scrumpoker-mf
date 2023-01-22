import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const gameRouter = router({
  createGame: publicProcedure.query(() => {
    console.log("Rquuu----");
    return {
      game: "game",
    };
  }),
});
