import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { CREATE_TABLE_PARAMS, DB_PARAM_KEY, DB_PARAM_UPDATE, DB_UPDATE_INPUT, DELETE_DOC_PARAMS, GET_DOC_PARAMS, INSERT_DOC_PARAMS, UPDATE_DOC_PARAMS } from "../interfaces/common";

const dynamoClient = new DynamoDBClient({
    // endpoint: 'http://localhost:8000',
});

const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoClient);


export const createTableIfNotExists = async (inputParams: CREATE_TABLE_PARAMS) => {
    return new Promise((resolve, reject) => {
        try {
            const params: any = {
                TableName: inputParams.tableName,
                AttributeDefinitions: [
                    {
                        AttributeName: inputParams.primaryKey,
                        AttributeType: "S"
                    }
                ],
                KeySchema: [
                    {
                        AttributeName: inputParams.primaryKey,
                        KeyType: "HASH"
                    }
                ],
                BillingMode: "PAY_PER_REQUEST",
            }

            // Adding a Global Secondary Index
            if (inputParams.gsiIndexName && inputParams.gsiAttributeName) {
                params.GlobalSecondaryIndexes = [
                  {
                    IndexName: inputParams.gsiIndexName,
                    KeySchema: [
                      {
                        AttributeName: inputParams.gsiAttributeName,
                        KeyType: 'HASH',
                      },
                    ],
                    Projection: {
                      ProjectionType: 'ALL',
                    },
                  },
                ];
                params.AttributeDefinitions.push({
                  AttributeName: inputParams.gsiAttributeName,
                  AttributeType: 'S',
                });
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
                    resolve(data);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

export const getDoc = (params: GET_DOC_PARAMS): Promise<DB_PARAM_KEY | undefined> => {
    return new Promise((resolve, reject) => {
        try {
            dynamoDBDocumentClient.send(new GetCommand(params), (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Item);
                }
            });
        } catch (err) {
            reject(err);
        }
    })
}


export const queryDoc = (params): Promise<DB_PARAM_KEY | undefined> => {
    return new Promise((resolve, reject) => {
        try {
            dynamoDBDocumentClient.send(new QueryCommand(params), (err, data) => {
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
                    reject(err);
                } else {
                    resolve(data.Attributes);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

// export const queryDoc = async (tableName: string, keyObj: DB_PARAM_KEY, responsekeys = ""): Promise<DB_PARAM_KEY | undefined> => {
//     return new Promise( async (resolve, reject) => {
//         try {
//             const data: any[] = [];
//             let resp: any = {};
//             do {
//                 resp = await queryDocsHelper(tableName, keyObj, responsekeys, resp.LastEvaluatedKey);
//                 if (resp.Items.length) {
//                     data.push(...resp.Items);
//                 }
//             } while (resp.LastEvaluatedKey);
//             resolve(data);
//         } catch (err) {
//             reject(err);
//         }
//     });
// }


// const queryDocsHelper = (tableName: string, keyObj: DB_PARAM_KEY, responsekeys = "", exclusiveStartKey: any = ""): Promise<any> => {
//     return new Promise((resolve, reject) => {
//         try {
//             dynamoDBDocumentClient.send(new QueryCommand(getDBParamQuery(tableName, keyObj, responsekeys, exclusiveStartKey)), (err, data) => {
//                 if (err) {
//                     reject(err);
//                 }
//                 else {
//                     resolve(data);
//                 }
//             });
//         } catch (err) {
//             reject(err);
//         }
//     });
// }

// const getDBParamQuery = (tableName: string, keyObj: DB_PARAM_KEY, responsekeys: string, exclusiveStartKey: any = "") => {
//     const dbParam = {
//         TableName: tableName,
//         KeyConditionExpression: "",
//         FilterExpression: "",
//         ExpressionAttributeValues: keyObj.ExpressionAttributeValues,
//         ProjectionExpression: responsekeys,
//         ExclusiveStartKey: exclusiveStartKey
//     }
//     if (!responsekeys) {
//         delete dbParam.ProjectionExpression;
//     }
//     if (!exclusiveStartKey) {
//         delete dbParam.ExclusiveStartKey;
//     }
//     let query = keyObj.FilterExpression || "";
//     const expressionAttributeValues: DB_PARAM_KEY = {};
//     if (!query) {
//         const keys = Object.keys(keyObj);
//         keys.forEach((k, index) => {
//             const isValueArray = Array.isArray(keyObj[k]);
//             if (isValueArray) {
//                 keyObj[k].forEach((valElement: string, i: number) => {
//                     expressionAttributeValues[':key' + i] = valElement;
//                 });
//             } else {
//                 expressionAttributeValues[':' + k] = keyObj[k];
//             }
//             if (index === 0) {
//                 if (isValueArray) {
//                     keyObj[k].forEach((valElement: string, i: number) => {
//                         if (i === 0) {
//                             query = k + ' in (' + " :key" + i + " ";
//                         } else {
//                             query += ", :key" + i;
//                         }
//                     });
//                     query += " )";
//                 } else {
//                     query = k + " = :" + k;
//                 }
//             } else {
//                 if (!isValueArray) {
//                     query += ' and ' + k + " = :" + k;
//                 }
//             }
//         });
//     }
//     if (query) {
//         dbParam.FilterExpression = query;
//     } else {
//         delete dbParam.FilterExpression;
//     }
//     if (Object.keys(expressionAttributeValues).length) {
//         dbParam.ExpressionAttributeValues = expressionAttributeValues;
//     }
//     if (!dbParam.ExpressionAttributeValues) {
//         delete dbParam.ExpressionAttributeValues;
//     }
//     return dbParam;
// }

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


export const scanDocs = (tableName: string, keyObj: DB_PARAM_KEY, responsekeys = ""): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const data: any[] = [];
            let resp: any = {};
            do {
                resp = await scanDocsHelper(tableName, keyObj, responsekeys, resp.LastEvaluatedKey);
                if (resp.Items.length) {
                    data.push(...resp.Items);
                }
            } while (resp.LastEvaluatedKey);
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}

const scanDocsHelper = (tableName: string, keyObj: DB_PARAM_KEY, responsekeys = "", exclusiveStartKey: any = ""): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            dynamoDBDocumentClient.send(new ScanCommand(getDBParamScan(tableName, keyObj, responsekeys, exclusiveStartKey)), (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

const getDBParamScan = (tableName: string, keyObj: DB_PARAM_KEY, responsekeys: string, exclusiveStartKey: any = "") => {
    const dbParam = {
        TableName: tableName,
        FilterExpression: "",
        ExpressionAttributeValues: keyObj.ExpressionAttributeValues,
        ProjectionExpression: responsekeys,
        ExclusiveStartKey: exclusiveStartKey
    }
    if (!responsekeys) {
        delete dbParam.ProjectionExpression;
    }
    if (!exclusiveStartKey) {
        delete dbParam.ExclusiveStartKey;
    }
    let query = keyObj.FilterExpression || "";
    const expressionAttributeValues: DB_PARAM_KEY = {};
    if (!query) {
        const keys = Object.keys(keyObj);
        keys.forEach((k, index) => {
            const isValueArray = Array.isArray(keyObj[k]);
            if (isValueArray) {
                keyObj[k].forEach((valElement: string, i: number) => {
                    expressionAttributeValues[':key' + i] = valElement;
                });
            } else {
                expressionAttributeValues[':' + k] = keyObj[k];
            }
            if (index === 0) {
                if (isValueArray) {
                    keyObj[k].forEach((valElement: string, i: number) => {
                        if (i === 0) {
                            query = k + ' in (' + " :key" + i + " ";
                        } else {
                            query += ", :key" + i;
                        }
                    });
                    query += " )";
                } else {
                    query = k + " = :" + k;
                }
            } else {
                if (!isValueArray) {
                    query += ' and ' + k + " = :" + k;
                }
            }
        });
    }
    if (query) {
        dbParam.FilterExpression = query;
    } else {
        delete dbParam.FilterExpression;
    }
    if (Object.keys(expressionAttributeValues).length) {
        dbParam.ExpressionAttributeValues = expressionAttributeValues;
    }
    if (!dbParam.ExpressionAttributeValues) {
        delete dbParam.ExpressionAttributeValues;
    }
    return dbParam;
}









