import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const accessTokenSecret = "youraccesstokensecret";

export const AuthHelper = () => {
  const getToken = (username: string): string => {
    return jwt.sign({ username: username }, accessTokenSecret);
  };
  return { getToken };
};

export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: () => void
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
