import { Request, RequestHandler, Response } from "express";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "../utils/response/index";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../utils/validators/user.validators";
import User, { Buyer, Seller } from "../models/user.model";
import { IAuthRequest } from "./types";

interface IUserController {
  Create: RequestHandler;
  Fetch: RequestHandler;
  Update: RequestHandler;
  Delete: RequestHandler;
}

const Create = async (req: Request, res: Response) => {
  try {
    let { err, value } = validateCreateUser(req.body);
    if (err) return handleErrorResponse(res, err.details[0].message, 400);
    let userExist = await User.findOne({ username: value.username });

    if (userExist) {
      // check if password is same with old password
      let passwordCorrect = userExist.comparePassword(value.password);

      // if password incorrect respond with error
      if (!passwordCorrect)
        handleErrorResponse(res, "account exist, incorrect password", 400);

      // if password correct login user account and return role on DB
      let token = userExist.generateLoginToken();
      return handleSuccessResponse(
        res,
        "login successful",
        {
          token,
          role: userExist.role,
        },
        200
      );
    }

    let user;
    // Call the right discrimator model based on user role
    if (value.role === "seller") {
      user = await Seller.create(value);
    } else {
      user = await Buyer.create(value);
    }

    let token = user.generateLoginToken();
    const responseData = {
      token,
      role: user.role,
    };
    return handleSuccessResponse(res, "account created!", responseData, 201);
  } catch (error) {
    console.log(error.message);
    return handleErrorResponse(res, "server issues, try again", 500);
  }
};

const Fetch = async (req: IAuthRequest, res: Response) => {
  try {
    let user = await User.findById(req.user._id).select("-password");
    if (!user) return handleErrorResponse(res, "user not found", 404);
    return handleSuccessResponse(
      res,
      "profile fetched",
      {
        user,
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
    let { err, value } = validateUpdateUser(req.body);
    if (err) return handleErrorResponse(res, err.details[0].message, 400);
    let user = await User.findByIdAndUpdate(req.user._id, value);
    if (!user) return handleErrorResponse(res, "user not found", 404);
    return handleSuccessResponse(res, "profile updated", value, 200);
  } catch (error) {
    console.log(error.message);
    return handleErrorResponse(res, "server issues, try again", 500);
  }
};

const Delete = async (req: IAuthRequest, res: Response) => {
  try {
    let user = await User.findById(req.user._id).select("-password");
    if (!user) return handleErrorResponse(res, "user not found", 404);
    return handleSuccessResponse(
      res,
      "profile fetched",
      {
        user,
      },
      200
    );
  } catch (error) {
    return handleErrorResponse(res, error.message, 500);
  }
};

const UserController: IUserController = {
  Create,
  Fetch,
  Update,
  Delete,
};

export default UserController;
