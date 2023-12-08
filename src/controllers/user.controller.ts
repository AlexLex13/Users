import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/encrypt";
import * as cache from "memory-cache";

export class UserController {
  static async signup(req: Request, res: Response) {
    const { firstName, lastName, email, password, image } = req.body;
    const encryptedPassword = await encrypt.encryptPass(password);
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = encryptedPassword;
    user.image = image;

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);

    const token = encrypt.generateToken(user.id);

    return res
      .status(200)
      .json({ message: "User created successfully", token, user });
  }
  static async getUsers(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
      console.log("serving from cache");
      return res.status(200).json({
        data,
      });
    } else {
      console.log("serving from db");
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();

      cache.put("data", users, 6000);
      return res.status(200).json({
        data: users,
      });
    }
  }
  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { firstName, lastName, email, image } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.image = image;

    await userRepository.save(user);
    res.status(200).json({ message: "update", user });
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    await userRepository.remove(user);
    res.status(200).json({ message: "ok" });
  }
}
