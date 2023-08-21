import { getUsers } from "../users/handler";
import jwt from "jsonwebtoken";
import { loginInput } from "./interface";


export const login = async (input: loginInput) => {
    const users = await getUsers();
    try {
        const user = users.data.find(user => user.userEmail === input.email);
        if (!user) {
            const err = new Error('The email you entered is not registered.');
            err['status'] = 400;
            throw err;
        } else if (user.userPassword == input.password) {
            const tokenPayload = {
                email: user.email
            };
            const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
            return {
                status: 'success',
                message: 'User Logged In!',
                data: {
                  accessToken,
                },
              };
        } else {
            const err = new Error('The password you entered is incorrect.');
            err['status'] = 400;
            throw err;
        }
    } catch (err) {
        return {
            status: 'error',
            message: err.message,
        };
    }
}