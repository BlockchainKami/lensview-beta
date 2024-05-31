import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createNamespace } from "cls-hooked";
import { initializeModules } from "./connections/initialize-modules.connection";
import { v4 as uuidv4 } from "uuid";
import routes from "./routes/index.route";

import { IS_PROD, PORT } from "./config/env.config";
import { ALLOWED_ORIGINS } from "./config/app-config.config";
import { logger } from "./log/log-manager.log";

const app = express();
const myRequest = createNamespace("lensview-app");

app.use(bodyParser.json());

app.use((_req, _res, next) => {
  myRequest.run(() => {
    myRequest.set("reqId", uuidv4());
    next();
  });
});

const allowedOrigins = IS_PROD
  ? ALLOWED_ORIGINS.PRODUCTION
  : ALLOWED_ORIGINS.DEVELOPMENT;
console.log("Allowed Origins:", allowedOrigins);

app.use(
  cors({
    optionsSuccessStatus: 200,
    origin: (origin, callback) => {
      if (!origin) {
        console.log("no origin");
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "Not Allowed by CORS";
        console.log(msg);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

app.use("/", routes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ message: err.message });
});

initializeModules()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`LensView server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(error);
  });
