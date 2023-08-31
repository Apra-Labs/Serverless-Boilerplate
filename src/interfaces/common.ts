
export interface API_RESPONSE {
    statusCode?: number,
    data?: any;
    error?: any;
    token?: string;
}

export interface DB_PARAMS {
    [key: string]: any;
}

export interface DB_PARAM_KEY {
    [key: string]: any;
}

export interface INSERT_DOC_PARAMS {
    TableName: string;
    Item: object;
}

export interface SCAN_DOC_PARAMS {
    TableName: string;
}

export interface DELETE_DOC_PARAMS {
    TableName: string;
    Key: object;
}

export interface UPDATE_DOC_PARAMS {
    TableName: string;
    primaryKey: DB_PARAM_KEY;
    updateKey: DB_PARAM_KEY;
}

export interface DB_UPDATE_INPUT {
    TableName: string;
    primaryKey: DB_PARAM_KEY;
    updateKey: DB_PARAM_KEY;
}

interface DB_PARAM_MANDATORY {
    TableName: string;
    ReturnValues?: string;
}

export interface DB_PARAM_UPDATE extends DB_PARAM_MANDATORY {
    ExpressionAttributeValues: DB_PARAM_KEY;
    UpdateExpression: string;
    Key: DB_PARAM_KEY;
}

export interface FileUploadParams {
    type: string;
    bucketName: string;
    fileName: string;
    fileContent: any;
    fileEncoding?: string;
}