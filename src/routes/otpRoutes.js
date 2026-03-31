import express from "express";
import { forgetPassword, resetPassword, verifyOtp } from "../controller/otpController.js";

export const otpRoute=express.Router();
otpRoute.post("/verify-otp",verifyOtp);
otpRoute.post("/forget-password",forgetPassword);
otpRoute.post('/reset-password',resetPassword)
