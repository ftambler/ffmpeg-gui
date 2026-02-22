import { Router } from "express";
import { handleRender } from "../controllers/renderController.js";

const router = Router();

router.post("/render", handleRender);

export default router;
