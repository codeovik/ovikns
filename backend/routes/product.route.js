import express from "express"
import { createProduct, deleteProduct, getAllProducts, getIndividualProduct, updateProduct } from "../controllers/product.controller.js"
import { protectAdmin } from "../middleware/admin.middleware.js"
import upload from "../middleware/multer.js"

const router = express.Router()

router.post("/", protectAdmin, upload.array("uploadImages", 5), createProduct)
router.get("/", getAllProducts)
router.get("/:id", getIndividualProduct)
router.put("/:id", protectAdmin, upload.array("images"), updateProduct)
router.delete("/:id", protectAdmin, deleteProduct)

export default router