import { getCommonAPIResponseByData, getCommonAPIResponseByError, getNewGuid } from "../../utils/commonUtils";
import { deleteDoc, getDoc, insertDoc, queryDoc, scanDocs, updateDoc } from "../../utils/dynamoDB";
import { DeleteFileFromS3, uploadFileToS3 } from "../../utils/s3";
import { DeleteInput, GetUserInput, UpdateInput, UpdateUserImage, UserInput, UserInputDoc } from "./interface";
import { loginInput } from "../authentication/interface";

export const createUser = async (input: UserInput): Promise<any> => {
    try {
        const userId = getNewGuid();
        const userInput: UserInputDoc = {
            userId: userId,
            userName: input.userName,
            userEmail: input.userEmail,
            userAddress: input.userAddress,
            userPhone: input.userPhone,
            userPassword: input.userPassword
        }

        const params = {
            TableName: process.env.USERS_TABLE,
            Item: userInput
        }
        await insertDoc(params);

        return getCommonAPIResponseByData({success: true});
    } catch (err) {
        throw getCommonAPIResponseByError(err);
    }
}

export const getUserById = async (input: GetUserInput): Promise<any> => {
    try{
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: {
                userId: input.userId
            }
        }

        const data = await getDoc(params);

        return getCommonAPIResponseByData(data);
    } catch (err) {
        throw getCommonAPIResponseByError(err);
    }
}


export const getUsers = async (): Promise<any> => {
    try {
        const params = {
            tableName: process.env.USERS_TABLE,
        }

        const data = await scanDocs(params.tableName, {});

        return getCommonAPIResponseByData(data);
    } catch (err) {
        console.error(err);
        throw getCommonAPIResponseByError(err);
    }
}

export const getUserByEmailAndPwd = async (input: loginInput) => {
    try {
        const params = {
            tableName: process.env.USERS_TABLE,
        }

        const data = await scanDocs(params.tableName, {
            FilterExpression: "userEmail = :userEmail and userPassword = :userPassword",
            ExpressionAttributeValues: {
                ":userEmail": input.userEmail,
                ":userPassword": input.userPassword
            }
        });
        return getCommonAPIResponseByData(data);
    } catch (err) {
        console.error(err);
        throw getCommonAPIResponseByError(err);
    }
}

export const queryUserFromDB = async (input: object): Promise<any> => {
    try {
        const params = {
            TableName: process.env.USERS_TABLE,
            IndexName: "usersGlobalIndex",
            KeyConditionExpression: "userEmail = :key1",
            ExpressionAttributeValues: {
                ":key1": input['userEmail']
            }
        }

        const data = await queryDoc(params);

        return getCommonAPIResponseByData(data);
    } catch (err) {
        console.error(err);
        throw getCommonAPIResponseByError(err);
    }
}

export const updateUser = async (input: UpdateInput) => {
    try {
        const params = {
            TableName: process.env.USERS_TABLE,
            primaryKey: {
                userId: input.userId
            },
            updateKey: {
                userName: input.userName,
                userAddress: input.userAddress,
            }
        }

        const data = await updateDoc(params);

        return getCommonAPIResponseByData(data);
    } catch (err) {
        console.error(err);
        throw getCommonAPIResponseByError(err);
    }
}


export const deleteUser = async (input: DeleteInput) => {
    try {
        const params = {
            TableName: process.env.USERS_TABLE,
            Key: {
                userId: input.userId

            }
        }

        await deleteDoc(params);

        return getCommonAPIResponseByData({success: true});
    } catch (error) {
        return error;
    }
}

export const updateUserImage = async (input: UpdateUserImage) => {
    try {

        const userImageName = getNewGuid();

        const resp = await uploadFileToS3({
            bucketName: process.env.MEDIA_BUCKET,
            fileName: userImageName,
            fileContent: input.userImage,
            type: 'image/jpeg',
            fileEncoding: 'base64'
        });

        if (resp) {
            const params = {
                TableName: process.env.USERS_TABLE,
                primaryKey: {
                    userId: input.userId
                },
                updateKey: {
                    userImage: userImageName
                }
            }

            await updateDoc(params);
        }
        return getCommonAPIResponseByData({
            success: true,
        });
    } catch (err) {
        getCommonAPIResponseByError(err);
    }
}


export const updateUserFile = async (input) => {
    try {
        const userFileName = getNewGuid();
        await uploadFileToS3({
            bucketName: process.env.MEDIA_BUCKET,
            fileName: userFileName,
            fileContent: input.files.userFile.data,
            type: input.files.userFile.mimetype,
        });

        // if(resp) {
        //     const params = {
        //         TableName: process.env.USERS_TABLE ,
        //         primaryKey: {
        //             userId: input.body.userId
        //         },
        //         updateKey: {
        //             userFile: userFileName
        //         }
        //     }

        //     const data = await updateDoc(params);
        //     console.log(data);
        // }
        return getCommonAPIResponseByData({
            success: true,
        });
    } catch (err) {
        getCommonAPIResponseByError(err);
    }
}

export const deleteUserFile = async (input) => {
    try {

        const resp = await DeleteFileFromS3(process.env.MEDIA_BUCKET, input.userFile);

        console.log(resp);

        // if(resp) {
        //     const params = {
        //         TableName: process.env.USERS_TABLE1,
        //         primaryKey: {
        //             userId: input.userId
        //         },
        //         updateKey: {
        //             userFile: null
        //         }
        //     }

        //     const data = await updateDoc(params);
        //     console.log(data);
        // }


        return getCommonAPIResponseByData({ success: true });
    } catch (err) {
        getCommonAPIResponseByError(err);
    }
}