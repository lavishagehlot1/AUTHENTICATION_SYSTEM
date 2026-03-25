import express from 'express';
import { registerUser } from '../controller/authController.js';
import { validation } from '../middleware/validation.js';
import { registerationSchema } from '../validations/authValidation.js';
const authRoute=express.Router();
authRoute.post('/registerUser',
    validation({body:registerationSchema}),
    registerUser);

export default authRoute;