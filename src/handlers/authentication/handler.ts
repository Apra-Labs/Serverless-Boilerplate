import { getUserByEmailAndPwd } from "../users/handler";
import { StatusCodes } from "http-status-codes";
import { loginInput } from "./interface";
import { getCommonAPIResponse, getCommonAPIResponseByError, signJWT } from "../../utils/commonUtils";


export const login = async (input: loginInput) => {
    const users = await getUserByEmailAndPwd({
        userEmail: input.userEmail,
        userPassword: input.userPassword
    });
    try {
        if (!users) {
            getCommonAPIResponseByError('No users found');
        }
        const user = users.data.find(user => user.userEmail === input.userEmail);

        if (!user) {

            const err = new Error('The email or password you entered is incorrect.');
            err['status'] = StatusCodes.BAD_REQUEST;
            throw err;

        } else if (user.userPassword == input.userPassword) {

            const tokenPayload = {
                email: user.userEmail
            };
            const accessToken = signJWT(tokenPayload);
            return getCommonAPIResponse({ message: 'success', data: { accessToken }, statusCode: StatusCodes.OK });

        } else {

            const err = new Error('The email and password entered is incorrect.');
            err['statusCode'] = StatusCodes.BAD_REQUEST;
            throw err;
            
        }
    } catch (err) {
        return getCommonAPIResponse({ error: err, statusCode: err.status, message: err.message });
    }
}