import PusherServer from "pusher";

export const pusherServerClient = new PusherServer({
  appId: "default",
  key: "app-key",
  secret: "app-secret",
  host: "localhost",
  port: "6001",
  useTLS: false,
  cluster: undefined,
});
