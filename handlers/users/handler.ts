import { getCommonAPIResponseByData, getCommonAPIResponseByError, getNewGuid } from "../../utils/commonUtils";
import { deleteDoc, insertDoc, scanDocs, updateDoc } from "../../utils/dynamoDB";
import { DeleteInput, UpdateInput, UserInput } from "./interface";

export const createUser = async (input: UserInput): Promise<any> => {
    try {
        const userId = getNewGuid();
        const userInput: UserInput = {
            id: userId,
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
        const data = await insertDoc(params);
        console.log(data);

        return getCommonAPIResponseByData({success: true});
    } catch (err) {
        console.error("Create User Failed");
        throw getCommonAPIResponseByError(err);
    }
}


export const getUsers = async (): Promise<any> => {
    try {
        const params = {
            TableName: process.env.USERS_TABLE
        }

        const data = await scanDocs(params);

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
                id: input.id
            },
            updateKey: {
                userName: input.userName,
                userAddress: input.userAddress,
            }
        }

        const data = await updateDoc(params);
        console.log(data);

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
                id: input.id
            }
        }

        const data = await deleteDoc(params);
        console.log(data);

        return getCommonAPIResponseByData(data);
    } catch (error) {
        return error;
    }
}