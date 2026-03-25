export const apiResponse=(statusCode,message,data={})=>{
    return {
        success:statusCode>=200 && statusCode<300,
    message:message,
    data:data
    }
}