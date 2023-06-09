import express from "express";
import UserController from "../controllers/user.controller";
import { CheckIfLoggedIn } from "../controllers/middelwares";
const userModule = express.Router();

userModule
  .route("/")
  .post(UserController.Create)
  .get(CheckIfLoggedIn, UserController.Fetch)
  .put(CheckIfLoggedIn, UserController.Update)
  .delete(CheckIfLoggedIn, UserController.Delete);

export default userModule;
