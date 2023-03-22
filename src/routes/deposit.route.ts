import express from "express";
import DepositController from "../controllers/deposit.controller";
import { CheckIfLoggedIn } from "../controllers/middelwares";
const depositModule = express.Router();

depositModule.route("/").post(CheckIfLoggedIn, DepositController.MakeDeposit);

export default depositModule;
