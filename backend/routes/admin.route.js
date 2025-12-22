import express from "express"
import { signin, signout, profile } from "../controllers/admin.controller.js"
import { protectAdmin } from "../middleware/admin.middleware.js"

const router = express.Router()

router.post("/signin", signin)
router.post("/signout", protectAdmin, signout)
router.get("/profile", protectAdmin, profile)

export default router