import { statusCodes } from "../utils/statusCode.js"
const globalErrorHandler=(err,req,res,next)=>{
    console.log("GLOBAL ERROR HANDLER",err.stack)
 
    if(err.isJoi){
        return res.status(statusCodes.BAD_REQUEST).json({
            success:false,
            message:err.details.map(details=>details.message).join(",")
        })
    }
    return res.status(statusCodes.SERVER_ERROR).json({
        success:false,
        message:"Internal Server Error"
    })
}

export default globalErrorHandler;