import dotenv from "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import adminRoutes from "./routes/admin.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import orderRoutes from "./routes/order.route.js"
import connectDB from "./config/db.js"

// config
connectDB()
const app = express()

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: process.env.FRONT_END_DOMAIN, credentials: true }))

// routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/cart", cartRoutes)
app.use("/api/v1/orders", orderRoutes);
app.get("/", (req, res) => {
  res.send(`🚀 Server running on http://localhost:${process.env.PORT} from ${new Date().toLocaleDateString("en-GB")} at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}`)
})

// server start
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT} from ${new Date().toLocaleDateString("en-GB")} at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}`)
})

export default app;