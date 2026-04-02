import express from 'express';
import { loginUser, logoutUser, refreshToken, registerUser } from '../controller/authController.js';
import { validation } from '../middleware/validation.js';
import { loginSchema, registerationSchema } from '../validations/authValidation.js';

const authRoute=express.Router();
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/registerUser:   
 *   post:
 *     summary: Register a new user and send OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - userEmail
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: John Doe
 *               userEmail:
 *                 type: string
 *                 example: doe.23@yopmail.com
 *               password:
 *                 type: string
 *                 example: pass1234
 *     responses:
 *       200:
 *         description: User registered successfully or OTP resent if user exists but not verified
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
 *                   example: OTP resent to your email for verification.
 *                 data:
 *                   type: object
 *                   properties:
 *                     userName:
 *                       type: string
 *                       example: John Doe
 *                     userEmail:
 *                       type: string
 *                       example: doe.23@yopmail.com
 *                     otp:
 *                       type: string
 *                       example: 123456
 *                     otpExpiry:
 *                       type: number
 *                       example: 1680345600000
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email is already registered and verified
 *       500:
 *         description: Server error
 */
authRoute.post(
  '/registerUser',
  validation({ body: registerationSchema }),
  registerUser
);


/**
 * @swagger
 * /api/auth/loginUser:   
 *   post:
 *     summary: Login user and get access & refresh tokens
 *     description: Logs in the user and returns an access token in the response body. The refresh token is stored as an HttpOnly cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *               - password
 *             properties:
 *               userEmail:
 *                 type: string
 *                 example: testuser@yopmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User not found, please register first
 *       500:
 *         description: Server error
 */
authRoute.post('/loginUser', validation({ body: loginSchema }), loginUser);

/**
 * @swagger
 * /api/auth/refreshToken:   
 *   post:
 *     summary: Refresh access token using refresh token
 *     description: Reads the refresh token from the HttpOnly cookie `refreshToken`. Returns a new access token in the response body.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *       401:
 *         description: No refresh token provided or token invalid/expired
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
authRoute.post('/refreshToken', refreshToken);


/**
 * @swagger
 * /api/auth/logout:   
 *   post:
 *     summary: Logout user and invalidate refresh token
 *     description: Reads the refresh token from the HttpOnly cookie `refreshToken`, removes it from the database, and clears the cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Server error during logout
 */
authRoute.post('/logout',logoutUser);

//authRoute.

export default authRoute;