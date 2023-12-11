import {Request, Response} from "express";
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
      res.status(500).json({ message: "invalid email" });
      return
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

    res.status(201).json({ message: "User created successfully", user });
  }
  static async getUsers(req: Request, res: Response) {
    const cache_users = cache.get("users");
    if (cache_users) {
      console.log("serving from cache");
      res.status(200).json({data: cache_users});
      return
    } else {
      console.log("serving from db");
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();

      cache.put("users", users, 6000);
      res.status(200).json({data: users});
    }
  }
  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { firstName, lastName, email, image } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    let user: User;
    try {
      user = await userRepository.findOne({where: { id }});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
      return
    }

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return
    }

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

    let user: User;
    try {
      user = await userRepository.findOne({where: { id }});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
      return
    }

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return
    }

    await userRepository.remove(user);
    res.status(204);
  }

  static async createProfile(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
        res.status(500).json({ message: "email required" });
        return
    }

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email }});
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return
    }

    const result = await pdf.createPDF(user);
    if (!result){
      res.status(500).json({ message: "Internal server error" });
      return
    }

    user.pdf = result

    await userRepository.save(user);
    res.status(200).json({ message: `The profile for the ${email} has been created!`});
  }
}
