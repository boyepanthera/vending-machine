import { Response, RequestHandler } from "express";
import { validateBuy } from "../utils/validators/sales.validators";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "../utils/response/index";
import { IAuthRequest } from "./types";
import { Buyer } from "../models/user.model";
import Sale from "../models/sales.model";
import Product from "../models/product.model";

interface ISalesController {
  Buy: RequestHandler;
}

const Buy = async (req: IAuthRequest, res: Response) => {
  try {
    if (req.user.role !== "buyer") {
      return handleErrorResponse(res, "only buyers can make deposit", 403);
    }
    let { err, value } = validateBuy(req.body);
    if (err) return handleErrorResponse(res, err.details[0].message, 400);
    let product = await Product.findById(value.productId);
    if (!product) {
      return handleErrorResponse(res, "product not found", 404);
    }
    if (product.amountAvailable < value.amount) {
      return handleErrorResponse(
        res,
        `not enough product in stock. ${product.amountAvailable} remaining`,
        404
      );
    }
    const depositor = await Buyer.findById(req.user._id);
    const amountDue = value.amount * product.cost;
    if (amountDue > depositor.deposit) {
      return handleErrorResponse(
        res,
        "insufficient wallet balance make more deposit",
        403
      );
    }
    depositor.deductFromDeposit(amountDue);
    product.deductQuantity(value.amount);
    const sales = await Sale.create({
      buyerId: req.user._id,
      product: value.productId,
      amount: value.amount,
      subTotal: amountDue,
    });
    return handleSuccessResponse(
      res,
      "product purchased!",
      { buy: sales },
      201
    );
  } catch (error) {
    console.log(error.message);
    return handleErrorResponse(res, "server issues, try again", 500);
  }
};

const SalesController: ISalesController = {
  Buy,
};

export default SalesController;
