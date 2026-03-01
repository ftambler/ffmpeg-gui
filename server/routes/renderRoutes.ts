import { Router } from "express";
import { handleVideoEdit } from "../controllers/renderController.js";

const router = Router();

router.post("/video/render", handleVideoEdit);

export default router;
