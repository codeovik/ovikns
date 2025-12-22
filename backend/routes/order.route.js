import express from "express"
import { createOrder, getOrders, updateOrderToPaid } from "../controllers/order.controller.js"
import { protectUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/", protectUser, createOrder)
router.get("/", protectUser, getOrders)
router.put("/:id/pay", protectUser, updateOrderToPaid)

export default router
