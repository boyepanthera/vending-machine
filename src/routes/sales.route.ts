import express from "express";
import SalesController from "../controllers/sales.controller";
import { CheckIfLoggedIn } from "../controllers/middelwares";
const salesModule = express.Router();

salesModule.route("/").post(CheckIfLoggedIn, SalesController.Buy);

export default salesModule;
