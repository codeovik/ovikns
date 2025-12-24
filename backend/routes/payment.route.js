import express from "express"
import { stripePayment, codPayment } from "../controllers/payment.controller.js"
import { protectUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/stripe", protectUser, stripePayment)
router.post("/cod", protectUser, codPayment)

export default router
