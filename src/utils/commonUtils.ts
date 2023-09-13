import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { API_RESPONSE } from "../interfaces/common";
import { StatusCodes } from "http-status-codes";


export const getCommonAPIResponseByData = (data: any, token?: string): API_RESPONSE => {
    return getCommonAPIResponse({ data, token });
}

export const getCommonAPIResponseByError = (error: any, token?: string): API_RESPONSE => {
    return getCommonAPIResponse({ data: undefined, error, token });
}

export const processRequest = (req: any, res: any, handler: any) => {
    handler(req.body).then((resp: API_RESPONSE) => {
        res.send(resp);
    }).catch((resp: API_RESPONSE) => {
        res.send(resp);
    });
} 

export const getCommonAPIResponse = (param: API_RESPONSE = {
    data: undefined,
    error: undefined,
    statusCode: undefined,
    message: undefined,
    token: undefined,
}): API_RESPONSE => {
    const resp: API_RESPONSE = param;
    if (param.error && !param.statusCode) {
        resp.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    } else if (!param.error && !param.statusCode && param.data) {
        resp.statusCode = StatusCodes.OK;
    }
    return resp;
}

export const getNewGuid = () => {
    return uuidv4();
};

export const signJWT = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

export const verifyJWT = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}