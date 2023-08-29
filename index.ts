import cors from "cors";
import express from "express";
import { router } from "./routes";
import serverless from "serverless-http";
import { Request, Response } from "express";
import { router as users } from "./handlers/users/routes";
import * as dotenv from "dotenv";
import statusCodes from "./constants/statusCode.json";

const environment = process.argv[2] || 'dev';
dotenv.config({path: `.env.${environment}`});

const LOCAL_PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', router);
app.use('/users', users);


app.use((req: Request, res: Response) => {
    return res.status(statusCodes.NOT_FOUND).json({ 
        error: 'API Not found', 
    });
});

app.listen(LOCAL_PORT, () => {
  console.log("server started at " + LOCAL_PORT);
});

module.exports.handler = serverless(app);