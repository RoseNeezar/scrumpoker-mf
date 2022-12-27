import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  checkUser: publicProcedure.query(() => {
    return {
      user: {
        id: 1,
        name: "hoho",
      },
    };
  }),
});
