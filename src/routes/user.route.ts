import * as express from "express";
import { authentication } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
import {FileController} from "../controllers/file.controller";
const Router = express.Router();

Router.get(
  "/users",
  authentication,
  UserController.getUsers
);
Router.get(
  "/profile",
  authentication,
  AuthController.getProfile
);
Router.post("/signup", UserController.signup);
Router.post("/login", AuthController.login);
Router.post("/upload/image", FileController.uploadImage);
Router.put(
  "/update/:id",
  authentication,
  UserController.updateUser
);
Router.delete(
  "/delete/:id",
  authentication,
  UserController.deleteUser
);
export { Router as userRouter };
