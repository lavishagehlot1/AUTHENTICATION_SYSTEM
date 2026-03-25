import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const authSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        trim:true
         },
    userEmail:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Email should be in write formate"
        ]
    },
    password:{
        type:String,
        required:true,
        minLength:[6,"Password should be at least 6 characters long"]
    },
     isVerified: {
    type: Boolean,
    default: false
  },

  otp: {
    type: String
  },

  otpExpiry: {
    type: Date
  }
},{timestamps:true});
 

 //pre save hook for hashing password
authSchema.pre('save',async function(){
    this.password=await bcrypt.hash(this.password,12);
})

//method for comparing password
authSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
//model creation 
const user=mongoose.model('user',authSchema);
export default user;