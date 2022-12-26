import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@scrumpoker-mf/api";

export const trpc = createTRPCReact<AppRouter>();
