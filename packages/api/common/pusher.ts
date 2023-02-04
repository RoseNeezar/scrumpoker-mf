import PusherServer from "pusher";

export const pusherServerClient = (() => {
  return new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.REACT_APP_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    host: process.env.REACT_APP_PUSHER_SERVER_HOST!,
    port: process.env.REACT_APP_PUSHER_SERVER_PORT!,
    useTLS: process.env.REACT_APP_PUSHER_SERVER_TLS === "true",
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER!,
  });
})();
