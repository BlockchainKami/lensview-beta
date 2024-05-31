import express from "express";
import {
  getSummaryCommentController,
  postAnonymousCommentController
} from "../controllers/comments.controller";
import { putAnonymousCommentController } from "../controllers/comments.controller";
import {
  validatePostAnonymousCommentRequestMiddleware,
  validatePutAnonymousCommentRequestMiddleware
} from "../middlewares/comments/validate-request.comments.middleware";

const router = express.Router();

router.post(
  "/anonymous",
  validatePostAnonymousCommentRequestMiddleware,
  postAnonymousCommentController
);
router.put(
  "/anonymous",
  validatePutAnonymousCommentRequestMiddleware,
  putAnonymousCommentController
);

router.get("/summarize", getSummaryCommentController);

export default router;
