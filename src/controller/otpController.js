import user from "../models/authModel.js";
import sendEmail from "../services/sendEmail.js";
import appError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { statusCodes } from "../utils/statusCode.js";
export const verifyOtp=async(req,res,next)=>{
    try{
        const{userEmail,otp}=req.body;
        console.log("Data from postman",req.body);
        //add validation for email and otp
        if(!userEmail||!otp) return appError(res,statusCodes.BAD_REQUEST,"All fields are required");

        //find user with email
        const existingUser=await user.findOne({userEmail});
        if(!existingUser) return appError(res,statusCodes.NOT_FOUND,'User not found with this email');

        //Check if user is already verified
        if(existingUser.isVerified) return appError(res,statusCodes.CONFLICT,"User is already verified");

        //Check if otp is valid
        if(existingUser.otp!==otp) return appError(res,statusCodes.BAD_REQUEST,"Invalid OTP");

        //check if otp is expired
        if(existingUser.otpExpiry<Date.now()) return appError(res,statusCodes.BAD_REQUEST,"OTP has expired, please request for new one");

        //if otp is valid and not expires, update user as verified
        existingUser.isVerified=true,
        existingUser.otp=null, //clear otp clear expiry after successful verification
        existingUser.otpExpiry=null, //clear otp expiry after successful verification
        await existingUser.save();

        await sendEmail(userEmail,null,"registrationSuccess",existingUser.userName);

        return res.status(statusCodes.SUCCESS).json(apiResponse(
            
                statusCodes.SUCCESS,
                "OTP verified successfully, your account is now verified",
              {  userEmail:existingUser.userEmail
            }
        ));


    }catch(err){
        console.log("SERVER ERROR:",err.name);
        next(err);
    }
}