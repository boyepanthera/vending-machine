import express from "express";
import userModule from "./user.route";
import productModule from "./product.route";
import depositModule from "./deposit.route";
import salesModule from "./sales.route";
const appModule = express.Router();

appModule.use("/user", userModule);
appModule.use("/product", productModule);
appModule.use("/deposit", depositModule);
appModule.use("/buy", salesModule);

export default appModule;
