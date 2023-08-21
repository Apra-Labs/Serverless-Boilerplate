import express from "express";
import { Request, Response } from "express";
import { login } from "./handlers/authentication/handler";
import { processRequest } from "./utils/commonUtils";
export const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});


router.post('/login', async (req: Request, res: Response) => {
    processRequest(req, res, login);
});


// module.exports = router;

// app.post('/doInit', (req: Request, res: Response) => {
//     doInit().then((resp: API_RESPONSE) => {
//         res.send(resp);
//     }).catch((resp: API_RESPONSE) => {
//         res.send(resp);
//     });
//   });