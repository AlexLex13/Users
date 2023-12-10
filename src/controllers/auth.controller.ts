import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { encrypt } from "../helpers/encrypt";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(500)
          .json({ message: "email and password required" });
      }

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = encrypt.comparePass(user.password, password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "invalid password" });
      }

      const token = encrypt.generateToken(user.id);

      return res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
