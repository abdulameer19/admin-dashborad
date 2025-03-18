import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      return next(new Error("User not found, token invalid"));
    }

    console.log("Authenticated User:", req.user);
    next();
  } catch (error) {
    res.status(401);
    return next(new Error(`Not authorized, token failed: ${error.message}`));
  }
});

export { protect };
