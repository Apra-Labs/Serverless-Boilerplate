export interface UserInput {
    userId: string;
    userName: string;
    userEmail: string;
    userAddress: string;
    userPhone: number;
    userPassword: string;
}

export interface UpdateInput {
    userId: string;
    userName: string;
    userAddress: string;
}

export interface DeleteInput {
    userId: string;
}

