import { Response, RequestHandler } from "express";
import { validateMakeDeposit } from "../utils/validators/deposit.validators";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "../utils/response/index";
import Deposit from "../models/deposit.model";
import { IAuthRequest } from "./types";
import { Buyer } from "../models/user.model";

interface IDepositController {
  MakeDeposit: RequestHandler;
}

const MakeDeposit = async (req: IAuthRequest, res: Response) => {
  try {
    let { err, value } = validateMakeDeposit(req.body);
    if (err) return handleErrorResponse(res, err.details[0].message, 400);
    const depositor = await Buyer.findById(req.user._id);
    let deposit = await Deposit.create({ ...value, depositor: depositor._id });
    depositor.addDeposit(deposit);
    return handleSuccessResponse(res, "deposit added!", { deposit }, 201);
  } catch (error) {
    console.log(error.message);
    return handleErrorResponse(res, "server issues, try again", 500);
  }
};

const DepositController: IDepositController = {
  MakeDeposit,
};

export default DepositController;
