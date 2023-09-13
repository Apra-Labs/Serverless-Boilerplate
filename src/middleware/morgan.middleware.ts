
import morgan from "morgan";
import logger from "../utils/logger";

const stream = {
  write: (message) => logger.http(message.substring(0, message.lastIndexOf('\n'))),
};

// const skip = () => {
//   const env = process.env.NODE_ENV || "dev";
//   return env !== "dev";
// };

export const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream }
);