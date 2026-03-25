import express from 'express';
import authRoute from '../src/routes/authRoutes.js'
import { otpRoute } from './routes/otpRoutes.js';
//app instance
const app=express();
//parsing data
app.use(express.json())

app.use('/api/auth',authRoute);
app.use('/api/otp',otpRoute)
export default app;