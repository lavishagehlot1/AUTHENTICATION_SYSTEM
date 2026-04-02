import express from "express";
import { forgetPassword, resetPassword, verifyOtp } from "../controller/otpController.js";

export const otpRoute=express.Router();
/**
 * @swagger
 * /api/otp/verify-otp:
 *   post:
 *     summary: Verify OTP sent to user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *               - otp
 *             properties:
 *               userEmail:
 *                 type: string
 *                 example: testuser@yopmail.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP verified successfully, account is now verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully, your account is now verified
 *                 data:
 *                   type: object
 *                   properties:
 *                     userEmail:
 *                       type: string
 *                       example: testuser@yopmail.com
 *       400:
 *         description: Missing fields, invalid OTP, or OTP expired
 *       404:
 *         description: User not found with the provided email
 *       409:
 *         description: User is already verified
 *       500:
 *         description: Server error
 */
otpRoute.post("/verify-otp", verifyOtp);


/**
 * @swagger
 * /api/otp/forget-password:
 *   post:
 *     summary: Request a password reset link via email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *             properties:
 *               userEmail:
 *                 type: string
 *                 example: testuser@yopmail.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Password reset link has been sent to your email
 *                 data:
 *                   type: object
 *                   properties:
 *                     resetLink:
 *                       type: string
 *                       example: https://client-app.com/reset-password/abc123def456
 *                     existingUser:
 *                       type: object
 *                       properties:
 *                         userEmail:
 *                           type: string
 *                           example: testuser@yopmail.com
 *                         userName:
 *                           type: string
 *                           example: Test User
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found with the provided email
 *       500:
 *         description: Server error
 */
otpRoute.post("/forget-password", forgetPassword);


/**
 * @swagger
 * /api/otp/reset-password:
 *   post:
 *     summary: Reset password using a valid reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               resetToken:
 *                 type: string
 *                 example: a1b2c3d4e5f6g7h8
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: NewStrongPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Password is reset successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     existingUser:
 *                       type: object
 *                       properties:
 *                         userEmail:
 *                           type: string
 *                           example: testuser@yopmail.com
 *                         userName:
 *                           type: string
 *                           example: Test User
 *       400:
 *         description: Missing fields, passwords do not match, or token invalid/expired
 *       500:
 *         description: Server error
 */
otpRoute.post('/reset-password', resetPassword);