import express from "express";
import { Request, Response } from "express";
import { login } from "./src//handlers/authentication/handler";
import { processRequest } from "./src/utils/commonUtils";
import { createS3Bucket } from "./src/utils/s3";
export const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});


router.post('/login', async (req: Request, res: Response) => {
    processRequest(req, res, login);
});

router.post('/createBucket', async (req: Request, res: Response) => {
    createS3Bucket(req.body.bucketName, true).then((resp) => {
        res.send(resp);
    });
});


// module.exports = router;

// app.post('/doInit', (req: Request, res: Response) => {
//     doInit().then((resp: API_RESPONSE) => {
//         res.send(resp);
//     }).catch((resp: API_RESPONSE) => {
//         res.send(resp);
//     });
//   });