import { Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { IAuthRequest } from "../types";
import Product from "../../models/product.model";
import { handleErrorResponse } from "../../utils/response/index";

export const CheckIfLoggedIn = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization && req.headers.authorization.length > 0) {
      const token = req.headers.authorization.split(" ")[1];
      const payload: any = await Jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        _id: payload._id,
        role: payload.role,
        username: payload.username,
      };
      next();
    } else {
      res.status(401).json({
        message: "Auth token not attached in request header",
      });
    }
  } catch (err) {
    res.status(401).json({ message: `Error with token. ${err.message}` });
  }
};

export const CheckIfProductOwner = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization && req.headers.authorization.length > 0) {
      const token = req.headers.authorization.split(" ")[1];
      const payload: any = await Jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        _id: payload._id,
        role: payload.role,
        username: payload.username,
      };
      const product = await Product.findById(req.params.id);
      if (product.sellerId === req.user._id) {
        next();
      } else {
        return handleErrorResponse(
          res,
          "only owner can perform this operation",
          403
        );
      }
    } else {
      return handleErrorResponse(res, "auth token not in request header", 401);
    }
  } catch (err) {
    console.log(err);
    handleErrorResponse(
      res,
      "server issues authorizing request, try again",
      500
    );
  }
};
