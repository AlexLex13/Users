import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import * as fileUpload from "express-fileupload";
import { userRouter } from "./routes/user.route";
import "reflect-metadata";
import {errorHandler} from "./middlewares/error.middleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(errorHandler);
const { PORT = 3000 } = process.env;
app.use("/auth", userRouter)

app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
