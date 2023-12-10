import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import * as EmailValidator from 'email-validator';
import { User } from "../entities/user.entity";
import { encrypt } from "../helpers/encrypt";
import * as cache from "memory-cache";
import {pdf} from "../helpers/pdf";

export class UserController {
  static async signup(req: Request, res: Response) {
    const { firstName, lastName, email, password, image } = req.body;

    if(!EmailValidator.validate(email)){
      return res.status(500).json({ message: "invalid email" });
    }

    const encryptedPassword = await encrypt.encryptPass(password);
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = encryptedPassword;
    user.image = image;

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);

    return res.status(200).json({ message: "User created successfully", user });
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

  static async createProfile(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
        return res.status(500).json({ message: "email required" });
    }

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email }, });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const result = await pdf.createPDF(user);
    if (!result){
      return res.status(500).json({ message: "Internal server error" });
    }

    user.pdf = result

    await userRepository.save(user);
    return res.status(200).json({ message: `The profile for the ${email} has been created!`});
  }
}
