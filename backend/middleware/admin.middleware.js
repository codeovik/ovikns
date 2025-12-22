import jwt from "jsonwebtoken"

export const protectAdmin = (req, res, next) => {
  const token = req.cookies.admin_token

  if (!token) {
    return res.status(401).json({ message: "Admin is not authorized" })
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET)
    if (decoded.admin) {
      next()
    } else {
      throw new Error("Token decode failed")
    }
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" })
  }
}