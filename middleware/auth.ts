import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import statusCodes from "../constants/statusCode.json";
import { getCommonAPIResponse } from "../utils/commonUtils";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.json(getCommonAPIResponse({
      statusCode: statusCodes.UNAUTHORIZED,
      error: 'Unauthorized!',
    }));
    return res;
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req['user'] = user;
    next();
  } catch (err) {
    res.json(getCommonAPIResponse({
      statusCode: statusCodes.UNAUTHORIZED,
      error: 'Unauthorized!',
    }));
  }
};