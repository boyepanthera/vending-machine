import { Response } from "express";
export const handleErrorResponse = (
  res: Response,
  message: string,
  statusCode: number
) => {
  return res.status(statusCode).json({
    message,
  });
};

export const handleSuccessResponse = (
  res: Response,
  message: string,
  responseData: any,
  statusCode: number
) => {
  return res.status(statusCode).json({
    message,
    data: responseData,
  });
};
