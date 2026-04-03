import mongoose from 'mongoose'
const DoctorSchema =new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        salary:{
            type:String,
            required:true
        },
        Qualfication:{
            type:String,
            required:true
        },
        experienceinyears:{
            type:Number,
            required:true,
            default:0
        },
        worksinHospital:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Hospital'
            }
        ]
,{timestamps:true})
export const Doctor =mongoose.model('Doctor',DoctorSchema)