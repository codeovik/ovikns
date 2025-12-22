import express from "express"
import { createPaymentIntent } from "../controllers/payment.controller.js"
import { protectUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/create-payment-intent", protectUser, createPaymentIntent)

export default router
