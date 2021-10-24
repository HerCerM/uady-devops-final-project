import { User } from "../entities/User";
import { createLogger } from "../loggers/logger";
import { AuthHelper } from "../middlewares/AuthMiddleware";

import { Request, Response } from "express";
import { Repository } from "typeorm";
import bcrypt from "bcrypt";

const LOGGER = createLogger(__filename);

export const UserController = (userRepository: Repository<User>) => {
  const getAll = async (req: Request, res: Response): Promise<Response> => {
    LOGGER.debug("Function call: getAll");

    LOGGER.debug(`Repository call: find - params: {}`);
    const users = await userRepository.find();
    return res.status(200).json(users);
  };

  const signUp = async (req: Request, res: Response): Promise<Response> => {
    LOGGER.debug("Function call: signUp");

    const providedUser = Object.assign(new User(), req.body);

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(providedUser.password, salt);

    try {
      const { id } = await userRepository.save({
        username: providedUser.username,
        password: hashedPassword,
      });
      return res.status(201).json({ userId: id });
    } catch (error: any) {
      LOGGER.error(`Message: ${error.message} - Stack trace: ${error.stack}`);
      return res.status(500).json({ error: "Unexpected DB error" });
    }
  };

  const getToken = async (req: Request, res: Response): Promise<Response> => {
    LOGGER.debug("Function call: getToken");

    const providedUser = Object.assign(new User(), req.body);
    LOGGER.debug(
      `Repository call: findOne - params: ${JSON.stringify({
        where: { username: providedUser.username },
      })}`
    );
    const user = await userRepository.findOne({
      where: { username: providedUser.username },
    });
    if (!user) {
      LOGGER.warn(`Invalid username or password`);
      return res.status(401).json({ error: "Invalid username or password" });
    }
    return await new Promise<Response>(function (resolve) {
      bcrypt.compare(
        providedUser.password,
        user.password,
        function (err, reslt) {
          if (err || !reslt) {
            LOGGER.warn(`Invalid username or password`);
            resolve(
              res.status(401).json({ error: "Invalid username or password" })
            );
          } else {
            resolve(
              res
                .status(200)
                .json({ token: AuthHelper().getToken(user.username) })
            );
          }
        }
      );
    });
  };

  return { getAll, signUp, getToken };
};
