import express from "express";
import userModule from "./user.route";
import productModule from "./product.route";
const appModule = express.Router();

appModule.use("/user", userModule);
appModule.use("/product", productModule);

export default appModule;
