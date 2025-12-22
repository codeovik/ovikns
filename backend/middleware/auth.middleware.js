import jwt from "jsonwebtoken"
import User from "../models/auth.model.js"

export const protectUser = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) return res.status(401).send("Not authenticated")

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).send("User not found")

    req.user = user
    next()
  } catch (err) {
    res.status(401).send("Invalid token")
  }
}