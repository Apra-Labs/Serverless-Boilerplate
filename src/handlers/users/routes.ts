import express from "express";
import { Request, Response } from "express";
import { processRequest } from "../../utils/commonUtils";
import { auth } from "../../middleware/auth";
import { API_RESPONSE } from "../../interfaces/common";
import { createUser, deleteUser, deleteUserFile, getUserById, getUsers, updateUser, updateUserFile, updateUserImage } from "./handler";

export const router = express.Router();

router.put('/', auth, (req: Request, res: Response) => {
    processRequest(req, res, createUser);
});

router.get('/', auth, (req: Request, res: Response) => {
    processRequest(req, res, getUsers);
});

router.delete('/', auth, (req: Request, res: Response) => {
    processRequest(req, res, deleteUser);
});

router.post('/', auth, (req: Request, res: Response) => {
    processRequest(req, res, updateUser);
});

router.get('/getUser', auth, (req: Request, res: Response) => {
    processRequest(req, res, getUserById);
});

router.post('/uploadImage', auth, (req: Request, res: Response) => {
    processRequest(req, res, updateUserImage);
});

router.post('/deleteFile', auth, (req: Request, res: Response) => {
    processRequest(req, res, deleteUserFile);
});

router.post('/uploadFile', auth, (req: Request, res: Response) => {
    updateUserFile(req).then((resp: any) => {
        res.send(resp);
    }).catch((resp: API_RESPONSE) => {
        res.send(resp);
    });
});