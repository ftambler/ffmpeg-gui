import { Router } from "express";
import { handleRender, handleVideoEdit } from "../controllers/renderController.js";

const router = Router();

router.post("/render", handleRender);

router.post("/timeline/render", handleVideoEdit);

export default router;
