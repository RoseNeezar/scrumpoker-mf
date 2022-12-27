import express, { Request, Response } from "express";

const AuthRoute = express.Router();

export const authUser = async (
  req: Request<{}, {}, { password: string }>,
  res: Response
) => {
  res.status(201).send({});
};

AuthRoute.route("/auth-user").post(authUser);

export const authChannel = async (
  req: Request<{}, {}, { password: string }>,
  res: Response
) => {
  res.status(201).send({});
};

AuthRoute.route("/auth-channel").post(authChannel);

export default AuthRoute;
