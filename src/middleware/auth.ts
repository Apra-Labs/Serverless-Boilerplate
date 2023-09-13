import { Request, Response, NextFunction } from "express";
import { getCommonAPIResponse, verifyJWT } from "../utils/commonUtils";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.json(getCommonAPIResponse({
      statusCode: StatusCodes.UNAUTHORIZED,
      error: ReasonPhrases.UNAUTHORIZED,
    }));
    return res;
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = verifyJWT(token);
    req['user'] = user;
    next();
  } catch (err) {
    res.json(getCommonAPIResponse({
      statusCode: StatusCodes.UNAUTHORIZED,
      error: ReasonPhrases.UNAUTHORIZED,
    }));
  }
};