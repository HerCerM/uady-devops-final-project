import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";

import { Request, Response } from "express";

export const UserController = (userRepository: UserRepository) => {
  const getAll = async (req: Request, res: Response): Promise<Response> => {
    const users = await userRepository.find();
    return res.status(200).json(users);
  };

  const post = async (req: Request, res: Response): Promise<Response> => {
    console.log("body: ", req.body);
    const providedUser = Object.assign(new User(), req.body);
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const hashedPassword = await bcrypt.hash(providedUser.password, salt);

    try {
      const { id } = await userRepository.save({
        username: providedUser.username,
        password: hashedPassword,
      });
      return res.status(201).json({ userId: id });
    } catch (error) {
      return res.status(500).json({ error: "Unexpected DB error" });
    }
  };

  return { getAll, post };
};
