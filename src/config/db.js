import mongoose from "mongoose";
export const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL||3000)
        console.log("MongoDB is connected successfully")
}catch(err){
    console.log("Error while connecting mongoDB",err.name)
    process.exit(0);
}
    }
    