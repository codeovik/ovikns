import express from "express"
import { addToCart, getCart, updateCartItem, removeCartItem, clearCart, getAllCarts, getCartSummary } from "../controllers/cart.controller.js"
import { protectUser } from "../middleware/auth.middleware.js"
import { protectAdmin } from "../middleware/admin.middleware.js"

const router = express.Router()

router.get("/", protectUser, getCart)
router.post("/", protectUser, addToCart)
router.put("/", protectUser, updateCartItem)
router.delete("/clear", protectUser, clearCart)
router.delete("/:itemId", protectUser, removeCartItem)
router.get("/all", protectAdmin, getAllCarts)
router.get("/summary", protectUser, getCartSummary)

export default router