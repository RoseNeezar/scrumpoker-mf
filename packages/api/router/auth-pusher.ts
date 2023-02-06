import express, { Request, Response } from "express";
import { pusherServerClient } from "../common/pusher";

const AuthRoute = express.Router();

export const authUser = async (
  req: Request<{}, {}, { socket_id: string }>,
  res: Response
) => {
  const { socket_id } = req.body;
  const { userId, nickname } = req.headers;
  console.log("---headers--user-", req.headers, req.body);
  if (!userId || typeof userId !== "string") {
    res.status(404).send("lol");
    return;
  }

  const auth = pusherServerClient.authenticateUser(socket_id, {
    id: userId,
    user_info: {
      name: nickname,
    },
  });

  res.send(auth);
};

AuthRoute.route("/auth-user").post(authUser);

export const authChannel = async (
  req: Request<{}, {}, { channel_name: string; socket_id: string }>,
  res: Response
) => {
  const { channel_name, socket_id } = req.body;
  const { userId, nickname } = req.headers;
  console.log("---headers--channel-", req.headers, req.body);
  if (!userId || typeof userId !== "string") {
    res.status(404).send("lol");
    return;
  }

  const auth = pusherServerClient.authorizeChannel(socket_id, channel_name, {
    user_id: userId,
    user_info: {
      name: nickname,
    },
  });

  res.send(auth);
};

AuthRoute.route("/auth-channel").post(authChannel);

export default AuthRoute;
