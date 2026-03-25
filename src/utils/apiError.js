const appError=(res,statusCode,message)=>{
    res.status(statusCode).json({
        status:false,
        message
    })
}
export default appError;