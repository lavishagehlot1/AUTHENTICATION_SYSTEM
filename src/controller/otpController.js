import user from "../models/authModel.js";
import sendEmail from "../services/sendEmail.js";
import appError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { statusCodes } from "../utils/statusCode.js";
import * as crypto from "node:crypto";
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

export const forgetPassword=async(req,res,next)=>{
    try{
        const {userEmail}=req.body;
        console.log("Data from postman",req.body);
        if(!userEmail) return appError(res,statusCodes.BAD_REQUEST,"Email is required");

        //find user with email
        const existingUser=await user.findOne({userEmail});
        if(!existingUser) return appError(res,statusCodes.NOT_FOUND,'User not found with this email');

        //generate token for password reset
        const resetToken=crypto.randomBytes(32).toString('hex');

        const hashedToken=crypto.createHash('sha256').update(resetToken).digest('hex');

        existingUser.paswordResetToken=hashedToken;
        existingUser.passwordResetTokenExpiry=Date.now()+10*60*1000; //token valid for 10 minutes

        await existingUser.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        //log it for testing
        console.log("Reset link:", resetLink);
        await sendEmail(userEmail,resetLink,"forgotPasswordTemplate",existingUser.userName)

        return res.status(statusCodes.SUCCESS).json(apiResponse(
            statusCodes.SUCCESS,
            "Password reset link has been sent to your email",
            { resetLink ,existingUser}
        ));


    }catch(err){
        console.log("Server error:",err.name,err.message);
        next(err);
    }
}

export const resetPassword=async(req,res,next)=>{
    try{
        const{resetToken,newPassword,confirmPassword}=req.body;
        console.log("Data from postman:",req.body);

        if(!resetToken||!newPassword||!confirmPassword) return appError(res,statusCodes.BAD_REQUEST,"All fileds are required");

        //comparing newpassword and confirm password
        if(newPassword!=confirmPassword) return appError(res,statusCodes.BAD_REQUEST,"Password is not equal");

        //Hashing the incoming token.
        const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex") //digest("hex")-->hexadecimal form
        console.log("HASHED TOKEN:",hashedToken)

        //find user with valid token
        const existingUser=await user.findOne({
            paswordResetToken:hashedToken,
            passwordResetTokenExpiry:{$gt:Date.now()}
        })
        console.log("existing user:",existingUser)

        if(!existingUser) return appError(res,statusCodes.BAD_REQUEST,"Token is invalid or expired")

        //update password
        existingUser.password=newPassword;

        //clear reset fields
        existingUser.paswordResetToken=undefined;
        existingUser.passwordResetTokenExpiry=undefined;

        //save new password
        await existingUser.save();

        //send mail also
        await sendEmail(
            existingUser.userEmail,
                 null,
                 "passwordResetSuccessTemplate",
                    existingUser.userName
                    );

        return res.status(statusCodes.SUCCESS).json(apiResponse(
            statusCodes.SUCCESS,
            "Password is reset sucessfully",
            {existingUser}
        ))

    }catch(err){
        console.log("Server error:",err.name,err.message);
        next(err);
    }
}