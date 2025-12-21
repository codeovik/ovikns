import express from "express"
import { getCart, addToCart, updateCartItem, removeFromCart, getCartSummary } from "../controllers/cart.controller.js"
import { protectUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/", protectUser, getCart)
router.post("/", protectUser, addToCart)
router.put("/:productId", protectUser, updateCartItem)
router.delete("/:productId", protectUser, removeFromCart)
router.get("/summary", protectUser, getCartSummary)

export default router