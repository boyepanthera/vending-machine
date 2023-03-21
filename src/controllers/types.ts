import { Request } from "express";

export interface ReqUser {
  _id: string;
  role: string;
  username: string;
}

export interface IAuthRequest extends Request {
  user: ReqUser;
}
