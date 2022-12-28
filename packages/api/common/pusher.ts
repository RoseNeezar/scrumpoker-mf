import PusherServer from "pusher";
import { env } from "@scrumpoker-mf/env";

export const pusherServerClient = new PusherServer({
  appId: env.server.PUSHER_APP_ID!,
  key: env.server.REACT_APP_PUSHER_APP_KEY!,
  secret: env.server.REACT_APP_PUSHER_APP_SECRET!,
  host: env.server.REACT_APP_PUSHER_SERVER_HOST!,
  port: env.server.REACT_APP_PUSHER_SERVER_PORT!,
  useTLS: env.server.REACT_APP_PUSHER_SERVER_TLS === "true",
  cluster: env.server.REACT_APP_PUSHER_APP_CLUSTER!,
});
