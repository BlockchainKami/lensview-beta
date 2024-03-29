import express from "express";
import { postNewPublicationController } from "../controllers/url.controller";
import { validatePostNewPublicationController } from "../middlewares/url/validate-request.url.middleware";
import { validateRequestQueryParameterMiddleware } from "../middlewares/publications/validate-request.publications.middleware";
import { urlExistsValidationController } from "../controllers/url.controller";
import { logger } from "../log/log-manager.log";

const router = express.Router();

logger.info("inside URL");

router.post(
  "/new-pub",
  validatePostNewPublicationController,
  postNewPublicationController
);
router.get(
  "/validate",
  validateRequestQueryParameterMiddleware,
  urlExistsValidationController
);

export default router;
