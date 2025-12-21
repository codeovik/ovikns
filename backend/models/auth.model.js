import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  googleId: String,
  password: { type: String, default: null }
})

export default mongoose.model("User", userSchema);