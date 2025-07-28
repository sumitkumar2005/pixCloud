import express from "express";
import photoController from "../controllers/photoController.js";
import  authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/:photoId/like", authenticate, photoController.likePhoto);
router.put("/:photoId/view", authenticate, photoController.viewPhoto);
router.post("/:photoId/comment", authenticate, photoController.addComment);
router.delete("/:photoId/comment/:commentId", authenticate, photoController.deleteComment);
router.post("/:photoId/comment/:commentIndex/reply", authenticate, photoController.replyToComment);

export default router;
