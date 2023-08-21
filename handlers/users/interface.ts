export interface UserInput {
    id: string;
    userName: string;
    userEmail: string;
    userAddress: string;
    userPhone: number;
    userPassword: string;
}

export interface UpdateInput {
    id: string;
    userName: string;
    userAddress: string;
}

export interface DeleteInput {
    id: string;
}

