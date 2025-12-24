import axios from "axios"
import jwt from "jsonwebtoken"
import User from "../models/auth.model.js"
import bcrypt from "bcrypt"

// redirect to google login page
export const googleLogin = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}&scope=profile email`
  res.redirect(url)
}

// google callback
export const googleCallback = async (req, res) => {
  // get code from redirect google login page
  const code = req.query.code

  try {
    // post code to oauth token endpoint
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code"
    })

    // get access token
    const accessToken = tokenRes.data.access_token

    // get user info with token
    const userRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    // extract user data from google account database
    const { id, email, name } = userRes.data

    // check if user already exists
    let user = await User.findOne({ email })

    // if user already abailable on database
    if (user) {
      // if user is already created by email & password
      if (user.authProvider === "local" && !user.googleId) return res.status(400).json({ message: "This email is already registered with email and password. Please login using email and password." })
    }
    // user not abailable on database
    else {
      // create new user with google data
      user = await User.create({ name, email, googleId: id, authProvider: "google" })
    }

    // create token for save in cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // save to cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // redirect
    res.redirect(`${process.env.FRONT_END_DOMAIN}/cart`)

    // test api in dev mode
    process.env.NODE_ENV === "development" ? console.log(`User ${user.email} logged in with Google`) : null
  }
  catch (err) {
    res.status(500).send("Authentication failed")
  }
}

// signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      if (existingUser.googleId) return res.status(400).json({ message: "This email is already registered with Google. Please login with Google." })

      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name, email, password: hashedPassword
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({ message: "Signup successful" })
  } catch (err) {
    res.status(500).json({ message: "Signup failed" })
  }
}

// signin
export const signin = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ message: "User not found" })

    if (user.googleId) return res.status(400).json({ message: "This account uses Google login. Please login with Google." })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: "Password is incorrect" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ message: "Signin successful" })
  } catch (err) {
    res.status(500).send({ message: "Signin failed" })
  }
}

// signout
export const signout = (req, res) => {
  res.clearCookie("token")
  res.status(200).json({ message: "Signout successful" })
}

// delete
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.clearCookie("token")
    res.status(200).json({ message: "Account deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete account" })
  }
}

// user info
export const isAuth = (req, res) => {
  const { password, ...userData } = req.user.toObject()
  res.status(200).json({ user: userData })
}

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}