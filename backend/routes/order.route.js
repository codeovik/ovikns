import express from "express";
import { makeOrder, getOrders } from "../controllers/order.controller.js";
import { protectUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectUser, makeOrder);
router.get("/", protectUser, getOrders);

export default router;