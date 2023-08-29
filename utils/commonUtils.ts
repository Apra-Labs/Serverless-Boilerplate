import { v4 as uuidv4 } from "uuid";
import { API_RESPONSE } from "../interfaces/common";
import statusCodes from "../constants/statusCode.json";


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
    token: undefined,
}): API_RESPONSE => {
    const resp: API_RESPONSE = param;
    if (param.error && !param.statusCode) {
        resp.statusCode = statusCodes.INTERNAL_SERVER_ERROR;
    } else if (!param.error && !param.statusCode && param.data) {
        resp.statusCode = statusCodes.OK;
    }
    return resp;
}

export const getNewGuid = () => {
    return uuidv4();
};