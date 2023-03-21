import express from "express";
import ProductController from "../controllers/product.controller";
import { CheckIfProductOwner } from "../controllers/middelwares";
const productModule = express.Router();

productModule
  .route("/product")
  .post(ProductController.Create)
  .get(CheckIfProductOwner, ProductController.Fetch);

productModule
  .route("/product/:id")
  .get(ProductController.FetchById)
  .put(CheckIfProductOwner, ProductController.Update)
  .delete(CheckIfProductOwner, ProductController.Delete);

export default productModule;
