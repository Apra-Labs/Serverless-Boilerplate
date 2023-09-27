export interface UserInput {
    userName: string;
    userEmail: string;
    userAddress: string;
    userPhone: number;
    userPassword: string;
}

export interface GetUserInput {
    userId: string;
}

export interface UserInputDoc extends UserInput {
    userId: string;
}

export interface UpdateInput {
    userId: string;
    userName: string;
    userAddress: string;
}

export interface UpdateUserImage {
    userId: string;
    userImage: string;
}

export interface UpdateUserFile {
    userId: string;
}

export interface DeleteInput {
    userId: string;
}

