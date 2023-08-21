import express from "express";
import { Request, Response } from "express";
import { processRequest } from "../../utils/commonUtils";
import { createUser, deleteUser, getUsers, updateUser } from "./handler";
import { auth } from "../../middleware/auth";

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