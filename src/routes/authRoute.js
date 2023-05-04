import express from "express";
import * as AuthController from "./../controllers/authController.js";

const router = express.Router();

router.post("/signup", [], AuthController.signup);
router.post("/login", [], AuthController.login);
router.get("/logout", [], AuthController.logout);
router.post("/forgot-password", [], AuthController.forgotPassword);
router.patch("/reset-password/:token", [], AuthController.resetPassword);
router.patch("/update-password", [AuthController.protect], AuthController.updatePassword);

export { router };
