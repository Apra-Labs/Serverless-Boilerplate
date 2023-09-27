import winston from "winston";
// import DailyRotateFile = require("winston-daily-rotate-file");
// import serverConfig from "../../serverConfig";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => {
    const env = process.env.NODE_ENV || 'dev';
    const isDevelopment = env === 'dev';
    return isDevelopment ? 'debug' : 'warn';
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors);

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

// const fileFormat = winston.format.combine(
//     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
//     winston.format.printf(
//         (info) => `${info.timestamp} ${info.level}: ${info.message}`,
//     ),
//     winston.format.json(),
// );

// const fileRotateTransport = new DailyRotateFile({
//     filename: serverConfig.fileLogPath,
//     datePattern: serverConfig.fileLogDatePattern,
//     maxFiles: serverConfig.fileLogMaxFiles,
//     handleExceptions: true,
//     format: fileFormat,
// });

const transports = [
    new winston.transports.Console(
        {
            format: consoleFormat,
        }
    ),
]

// {
//     console.log('process.env.NODE_ENV', process.env.NODE_ENV)
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     //@ts-ignore
//     process.env.NODE_ENV === 'local' && transports.push(fileRotateTransport)
// }

const logger = winston.createLogger({
    level: level(),
    levels,
    transports,
});

export default logger;