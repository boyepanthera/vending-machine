import { Request, Response, RequestHandler } from "express";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../utils/validators/product.validators";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "../utils/response/index";
import Product from "../models/product.model";
import { IAuthRequest } from "./types";

interface IProductController {
  Create: RequestHandler;
  Fetch: RequestHandler;
  FetchById: RequestHandler;
  Update: RequestHandler;
  Delete: RequestHandler;
}

const Create = async (req: IAuthRequest, res: Response) => {
  try {
    let { err, value } = validateCreateProduct(req.body);
    if (err) return handleErrorResponse(res, err.details[0].message, 400);
    if (req.user.role !== "seller")
      return handleErrorResponse(res, "only sellers can upload products", 403);
    let product = await Product.create({ ...value, sellerId: req.user._id });
    return handleSuccessResponse(res, "product  updated!", { product }, 201);
  } catch (error) {
    console.log(error.message);
    return handleErrorResponse(res, "server issues, try again", 500);
  }
};

const Fetch = async (req: Request, res: Response) => {
  try {
    let products = await Product.find({});
    return handleSuccessResponse(
      res,
      "products fetched",
      {
        products,
      },
      200
    );
  } catch (error) {
    console.log(error.message);
    return handleErrorResponse(res, "server issues, try again.", 500);
  }
};

const FetchById = async (req: Request, res: Response) => {
  try {
    let product = await Product.findById(req.params.id);
    return handleSuccessResponse(
      res,
      "products fetched",
      {
        product,
      },
      200
    );
  } catch (error) {
    console.log(error.message);
    return handleErrorResponse(res, "server issues, try again.", 500);
  }
};

const Update = async (req: IAuthRequest, res: Response) => {
  try {
    let { err, value } = validateUpdateProduct(req.body);
    if (err) return handleErrorResponse(res, err.details[0].message, 400);
    let product = await Product.findByIdAndUpdate(req.params.id, value);
    if (!product) return handleErrorResponse(res, "product not found", 404);
    return handleSuccessResponse(res, "product updated", value, 200);
  } catch (error) {
    console.log(error.message);
    return handleErrorResponse(res, "server issues, try again", 500);
  }
};

const Delete = async (req: IAuthRequest, res: Response) => {
  try {
    let user = await Product.findByIdAndDelete(req.params.id);
    if (!user) return handleErrorResponse(res, "product not found", 404);
    return handleSuccessResponse(res, "product destroyed", null, 200);
  } catch (error) {
    console.log(error.message);
    return handleErrorResponse(res, "server issues, try again", 500);
  }
};

const ProductController: IProductController = {
  Create,
  Fetch,
  FetchById,
  Update,
  Delete,
};

export default ProductController;
