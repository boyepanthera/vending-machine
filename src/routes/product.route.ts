import express from "express";
import ProductController from "../controllers/product.controller";
import {
  CheckIfProductOwner,
  CheckIfLoggedIn,
} from "../controllers/middelwares";
const productModule = express.Router();

productModule
  .route("/")
  .post(CheckIfLoggedIn, ProductController.Create)
  .get(ProductController.Fetch);

productModule
  .route("/:id")
  .get(ProductController.FetchById)
  .put(CheckIfProductOwner, ProductController.Update)
  .delete(CheckIfProductOwner, ProductController.Delete);

export default productModule;
