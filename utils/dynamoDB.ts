//@ts-check
import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DB_PARAM_KEY, DB_PARAM_UPDATE, DB_UPDATE_INPUT, DELETE_DOC_PARAMS, INSERT_DOC_PARAMS, SCAN_DOC_PARAMS, UPDATE_DOC_PARAMS } from "../interfaces/common";

const dynamoClient = new DynamoDBClient({
    endpoint: "http://localhost:8000",
});

const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoClient);


export const createTableIfNotExists = async (tableName: string, primaryKey: string) => {
    return new Promise((resolve, reject) => {
        try {
            const params = {
                TableName: tableName,
                AttributeDefinitions: [
                    {
                        AttributeName: primaryKey,
                        AttributeType: "S"
                    }
                ],
                KeySchema: [
                    {
                        AttributeName: primaryKey,
                        KeyType: "HASH"
                    }
                ],
                BillingMode: "PAY_PER_REQUEST",
            }


            dynamoDBDocumentClient.send(new CreateTableCommand(params), (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        } catch (err) {
            console.error(err);
        }
    });
}


export const insertDoc = (params: INSERT_DOC_PARAMS): Promise<DB_PARAM_KEY | undefined> => {
    return new Promise((resolve, reject) => {
        try {
            dynamoDBDocumentClient.send(new PutCommand(params), (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data.Attributes);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}


export const scanDocs = (params: SCAN_DOC_PARAMS): Promise<DB_PARAM_KEY | undefined> => {
    return new Promise((resolve, reject) => {
        try {
            dynamoDBDocumentClient.send(new ScanCommand(params), (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data.Items);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}


export const deleteDoc = (params: DELETE_DOC_PARAMS): Promise<DB_PARAM_KEY | undefined> => {
    return new Promise((resolve, reject) => {
        try {
            dynamoDBDocumentClient.send(new DeleteCommand(params), (err, data) => {
                if (err) {
                    console.log(params);
                    console.error(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (err) {
            reject(err);
        }
    })
}

export const updateDoc = (params: UPDATE_DOC_PARAMS): Promise<DB_PARAM_KEY | undefined> => {
    return new Promise((resolve, reject) => {
        try {
            const updateParams = getDBParamUpdate(params.TableName, params);
            dynamoDBDocumentClient.send(new UpdateCommand(updateParams), (err, data) => {
                if (err) {
                    console.log(params);
                    console.error(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}


const getDBParamUpdate = (tableName: string, keyObj: DB_UPDATE_INPUT) => {
    const primaryObj = keyObj.primaryKey;
    const updateObj = keyObj.updateKey;
    const dbParam: DB_PARAM_UPDATE = {
      ExpressionAttributeValues: {},
      UpdateExpression: "",
      TableName: tableName,
      Key: {
        ...primaryObj,
      },
      ReturnValues: "ALL_NEW",
    };
    const expressionAttributeValues: DB_PARAM_KEY = {};
    let query = "";
    Object.keys(updateObj).forEach((k, index) => {
      expressionAttributeValues[":" + k] = updateObj[k];
      query += (index === 0 ? "set " : ", ") + k + " = :" + k;
    });
  
    dbParam.UpdateExpression = query;
    dbParam.ExpressionAttributeValues = expressionAttributeValues;
  
    return dbParam;
  };

// export const insertDoc = async (params: INSERT_DOC_PARAMS): Promise<DB_PARAM_KEY | undefined> => {
//     const resp = await dynamoDBDocumentClient.send(new PutCommand(params));
//     return resp;
// };


// export const scanDocs = async (params: SCAN_DOC_PARAMS): Promise<DB_PARAM_KEY | undefined> => {
//     const data = await dynamoDBDocumentClient.send(new ScanCommand(params));
//     return data.Items;
// };












