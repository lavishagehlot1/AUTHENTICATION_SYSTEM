import express from 'express';
import { loginUser, logoutUser, refreshToken, registerUser } from '../controller/authController.js';
import { validation } from '../middleware/validation.js';
import { loginSchema, registerationSchema } from '../validations/authValidation.js';

const authRoute=express.Router();
authRoute.post('/registerUser',
    validation({body:registerationSchema}),
    registerUser);

authRoute.post('/loginUser',
    validation({body:loginSchema}),
    loginUser);

authRoute.post('/refreshToken',refreshToken)

authRoute.post('/logout',logoutUser);

//authRoute.

export default authRoute;