import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { encrypt } from "../helpers/encrypt";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(500).json({ message: "email and password required" });
        return
      }

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return
      }

      const isPasswordValid = encrypt.comparePass(user.password, password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "invalid password" });
        return
      }

      const token = encrypt.generateToken(user.id);

      res.status(200).json({ message: "Login successful", user, token });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
