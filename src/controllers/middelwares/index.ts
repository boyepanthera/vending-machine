import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { IAuthRequest, ReqUser } from "../types";

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
