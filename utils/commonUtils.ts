import { v4 as uuidv4 } from "uuid";
import { API_RESPONSE } from "../interfaces/common";


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
        resp.statusCode = 500;
    } else if (!param.error && !param.statusCode && param.data) {
        resp.statusCode = 200;
    }
    return resp;
}

export const getNewGuid = () => {
    return uuidv4();
};