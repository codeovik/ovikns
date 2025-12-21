import express from "express";
import { googleLogin, googleCallback, signup, signin, signout, isAuth, deleteAccount, getAllUsers } from "../controllers/auth.controller.js";
import { protectUser } from "../middleware/auth.middleware.js";
import { protectAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", protectUser, signout);
router.get("/profile", protectUser, isAuth);
router.delete("/delete", protectUser, deleteAccount);
router.get("/users", protectAdmin, getAllUsers);

export default router;