import { UserController } from "../../controllers/UserController";
import { UserRepository } from "../../repositories/UserRepository";
import { RouterAssembler } from "../RouterAssembler";

import { Router } from "express";
import { getCustomRepository } from "typeorm";

export const UserRouter = (): RouterAssembler => {
  const userController = UserController(getCustomRepository(UserRepository));
  const router = Router();
  router.route("/users").get( userController.getAll);
  return { getAssembledRouter: () => router };
};
