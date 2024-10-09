import express from "express";
import {
    authUser,
    registerUser,
    getUserById,
    updateUserProfile,
    authUserAdmin
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/login-admin", authUserAdmin);

router.route("/update-user").post(protect,updateUserProfile);
router.route('/get-user/:id').get(protect, getUserById);


export default router;