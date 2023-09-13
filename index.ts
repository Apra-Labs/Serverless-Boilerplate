import cors from "cors";
import express from "express";
import { router } from "./routes";
import serverless from "serverless-http";
import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { router as users } from "./src/handlers/users/routes";
import * as dotenv from "dotenv";
import serverConfig from "./serverConfig";
import { StatusCodes } from "http-status-codes";
import logger  from "./src/utils/logger";
import { morganMiddleware } from "./src/middleware/morgan.middleware";

const environment = process.argv[2] || 'dev';
dotenv.config({ path: `.env.${environment}` });

const LOCAL_PORT = process.env.PORT;

const app = express();
app.use(morganMiddleware);
app.use(cors());
app.use(fileUpload());
app.use(express.json({
    limit: serverConfig.JSONLimit
}));

app.use('/', router);
app.use('/users', users);


app.use((req: Request, res: Response) => {
    return res.status(StatusCodes.NOT_FOUND).json({
        error: 'API Not found',
    });
});

app.listen(LOCAL_PORT, () => {
    logger.info(`server started at ${LOCAL_PORT}`);
});

module.exports.handler = serverless(app);