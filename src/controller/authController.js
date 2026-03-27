import user from '../models/authModel.js';
import appError from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { statusCodes } from '../utils/statusCode.js';
import { generateOtp } from '../utils/generateOtp.js';
import sendEmail from '../services/sendEmail.js';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../services/generateToken.js';


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

        const users=await user.findOne({userEmail});
        if(!users)return appError(res,statusCodes.NOT_FOUND,"User not found ,please register first");

        const accessToken =await generateToken({payload:{id:users._id},type:"access"});
        console.log("ACCESS TOKEN:",accessToken);

        const refreshToken=await generateToken({payload:{id:users._id},type:"refresh"});
        console.log("REFRESH TOKEN:",refreshToken);

        //SAVE hashed REFRESH TOKEN IN DATABASE
        const hashedRefreshToken=await bcrypt.hash(refreshToken,12);
        users.refreshToken=hashedRefreshToken;
        await users.save();

        //SEND REFRESH TOKEN IN HTTPONLY COOKIE
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:7*24*60*60*1000 //7 days
        })



        return res.status(statusCodes.SUCCESS).json(apiResponse(statusCodes.SUCCESS,"Login successfully",accessToken));
    }catch(err){
       next(err);
    }
}

export const refreshToken=async(req,res)=>{
    const Token=req.cookies.refreshToken;
    console.log("REFRESH TOKEN FROM COOKIE:",Token);
    if(!Token) return appError(res,statusCodes.UNAUTHORIZED,"No refresh token provided");
    try{
        const decoded=await verifyToken(Token,"refresh");
        console.log("Decoded refresh token:",decoded);
        //check if user exist in database
        const users=await user.findById(decoded.id);
        if(!users) return appError(res,statusCodes.NOT_FOUND,"User not found");
        console.log("User data from database:",users);

        //check if refresh token is valid using bcrypt compare
        const isValidRefreshToken=await bcrypt.compare(Token,users.refreshToken);
        if(!isValidRefreshToken) return appError(res,statusCodes.UNAUTHORIZED,"Invalid refresh token");
        console.log("Refresh token is valid",isValidRefreshToken);
    

        //generate new access token
        const newAccessToken=await generateToken({payload:{id:users._id},type:"access"});
        console.log("NEW ACCESS TOKEN:",newAccessToken);
        
        return res.status(statusCodes.SUCCESS).json(apiResponse(statusCodes.SUCCESS,"New access token generated",newAccessToken));
    }catch(err){
        console.log("REFRESH TOKEN ERROR:",err.name);
        return appError(res,statusCodes.UNAUTHORIZED,"Invalid or expired refresh token");
    }
}


export const logoutUser=async(req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;
        console.log("REFRESH TOKEN FROM COOKIE:",refreshToken);
        if(refreshToken){
            //find all user with this refresh token and remove it from database
            const users=await user.find({refreshToken:{$ne:null}}); //find user with non null refresh token;

            //compare the refresh token from cookie with hashed refresh token in database using bcrypt compare and remove it from database if match found
           for(const u of users){
            const isMatch=await bcrypt.compare(refreshToken,u.refreshToken);
            if(isMatch){
                u.refreshToken=null;
                await u.save();
                console.log("Refresh token removed from database for user:",u);
                break; //break the loop after finding the user with matching refresh token and removing it from database
            }
           }
        }
        //clear cookie in browser
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
        })
        return res.status(statusCodes.SUCCESS).json(apiResponse(statusCodes.SUCCESS,"Logged out successfully"));
    }catch(err){
        console.log("LOGOUT ERROR:",err.name);
        return res.status(statusCodes.SERVER_ERROR).json(apiResponse(statusCodes.SERVER_ERROR,"Server error during logout"));
    }
}

