// f:\ovikns\backend\routes\config.route.js
import express from "express";
import { getConfig, updateConfig } from "../controllers/config.controller.js";
import { protectAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public route to get config
router.get("/", getConfig);

// Admin only route to update config
router.put("/", protectAdmin, updateConfig);

export default router;