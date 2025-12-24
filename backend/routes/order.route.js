import express from "express"
import { createOrder, getAllOrders, getOrders, updateOrderStatus } from "../controllers/order.controller.js"
import { protectUser } from "../middleware/auth.middleware.js"
import { protectAdmin } from "../middleware/admin.middleware.js"

const router = express.Router()

router.post("/", protectUser, createOrder)
router.get("/", protectUser, getOrders)
router.get("/all", protectAdmin, getAllOrders)
router.put("/:orderId/status", protectAdmin, updateOrderStatus)

export default router