import jwt from "jsonwebtoken";

export const signin = (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.ADMIN_JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .status(200).json({ message: "Admin sign-in successful" });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
};

export const signout = (req, res) => {
  try {
    res
      .clearCookie("admin_token")
      .status(200).json({ message: "Admin signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to sign out admin" });
  }
};

export const profile = (req, res) => {
  res.status(200).json({ message: "Admin is authenticated", isAdmin: true, });
};