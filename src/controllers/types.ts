import { Request } from "express";
import { IUser } from "../models/user.model";

export interface ReqUser {
  _id: string;
  role: string;
  username: string;
}

export interface IAuthRequest extends Request {
  user: ReqUser;
}
