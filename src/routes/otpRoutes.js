import express from "express";
import { verifyOtp } from "../controller/otpController.js";
export const otpRoute=express.Router();
otpRoute.post("/verify-otp",verifyOtp)