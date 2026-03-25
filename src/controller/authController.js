import user from '../models/authModel.js';
import appError from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { statusCodes } from '../utils/statusCode.js';
import { generateOtp } from '../utils/generateOtp.js';
import sendEmail from '../services/sendEmail.js';


export const registerUser=async(req,res,next)=>{
    try{
        const {userName,userEmail,password}=req.body;
        console.log("Data from postman",req.body);
        if(!userName||!userEmail||!password) return appError(res,statusCodes.BAD_REQUEST,"All fields are required");

        //if email is already registered
        const existingUser=await user.findOne({userEmail});
        console.log("ALREADY EXISTING USER:",existingUser);
        // if(existingUser) return appError(res,statusCodes.CONFLICT,"Email is already registered");


        const otp=generateOtp();
        console.log("Generated OTP:",otp);

        if(existingUser){
            //if user is verified again try to register with same email
            if(existingUser.isVerified) return appError(res,statusCodes.CONFLICT,"Email is already registered and verified");
        

        //User exist but not verified, update the user data with new details and resend otp
        existingUser.userName=userName;
        existingUser.password=password;
        existingUser.otp=otp;
        existingUser.otpExpiry=Date.now()+10*60*1000; //otp valid for 10 minutes
        await existingUser.save();
        
        await sendEmail(userEmail,otp,"resendOtp",userName);

        return res.status(statusCodes.SUCCESS).json(apiResponse(statusCodes.SUCCESS,"OTP resent to your email for verification",existingUser));
        }else{
            const users=await user.create({
                userName,
                userEmail,
                password,
                otp,
                otpExpiry: Date.now() + 10 * 60 * 1000,
                isVerified: false,

            })
            console.log("User data:",users)

        await sendEmail(userEmail,otp,"register",userName);

        return res.status(statusCodes.SUCCESS).json(apiResponse(statusCodes.SUCCESS,`User ${userName} registered successfully`,users))

    }
} catch(err){
        console.log("SERVER ERROR:",err.name);
       next(err);
    }
}


export const loginUser=async(req,res,next)=>{
    try{
        const{userEmail,password}=req.body;
        console.log("Data from postman",userEmail,password);
        if(!userEmail||!password) return appError(res,statusCodes.BAD_REQUEST,"All fields are required");

        const users=await user.findOne({userEmail})

    }catch(err){
       next(err);
    }
}