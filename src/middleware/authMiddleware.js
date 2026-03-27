
import appError from '../utils/apiError.js'
import {statusCodes} from '../utils/statusCode.js'
import { verifyToken } from "../services/generateToken.js";
import user from "../models/authModel.js"

export const authorization=async(req,res,next)=>{
    const authHeader=req.headers.authorization;
    console.log("authHeader",authHeader);
    if(!authHeader||!authHeader.startsWith("Bearer ")){
        return appError(res,statusCodes.UNAUTHORIZED,"You are not authorized to access this resource");
    }
    const token=authHeader.split(" ")[1];
    console.log("TOKEN:",token);

    try{
        const decoded= verifyToken(token,"access");
        console.log("Decoded token:",decoded);

        //check user exists in database or not
        const currentUser=await user.findById(decoded.id);
        if(!currentUser){
            return appError(res,statusCodes.UNAUTHORIZED,"The user belonging to this token does not exist");
        }
        //attach user info to request object
        req.user=currentUser;
        next();

    }catch(err){
        console.log("Error in authorization middleware",err.name);
        return appError(res,statusCodes.UNAUTHORIZED,"You are not authorized to access this resource");
    }
    
}