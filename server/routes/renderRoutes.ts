import { Router } from "express";
import { handleVideoEdit } from "../controllers/renderController.js";
import { handleProgressStream } from "../controllers/jobsController.js";

const router = Router();

router.get("/video/progress/:jobId", handleProgressStream);

router.post("/video/render", handleVideoEdit);

export default router;
