import express from "express";
import UserController from "../controllers/user.controller";
import { CheckIfLoggedIn } from "../controllers/middelwares/";
const userModule = express.Router();

userModule
  .route("/user")
  .post(UserController.Create)
  .get(CheckIfLoggedIn, UserController.Fetch);

export default userModule;
