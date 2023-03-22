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
  ResetDeposit: RequestHandler;
}

const MakeDeposit = async (req: IAuthRequest, res: Response) => {
  try {
    if (req.user.role !== "buyer") {
      return handleErrorResponse(res, "only buyers can make deposit", 403);
    }
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

const ResetDeposit = async (req: IAuthRequest, res: Response) => {
  try {
    if (req.user.role !== "buyer") {
      return handleErrorResponse(res, "only buyers can reset deposit", 403);
    }
    const depositor = await Buyer.findById(req.user._id);
    await Deposit.deleteMany({ _id: { $in: depositor.deposits } });
    depositor.resetDeposit();
    return handleSuccessResponse(res, "deposit reset", null, 201);
  } catch (error) {
    console.log(error.message);
    return handleErrorResponse(res, "server issues, try again", 500);
  }
};

const DepositController: IDepositController = {
  MakeDeposit,
  ResetDeposit,
};

export default DepositController;
