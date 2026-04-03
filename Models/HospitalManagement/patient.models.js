import mongoose from "mongoose";
const PatientSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        dignoseWith:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        gender:{
            type:String,
            enum:['M','F','O'],
            required:true
        },
        address:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        bloodGroup:{
            type:String,
            required:true
        },
        admittedin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Hospital',
            required:true
        },
        doctor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Doctor',
            required:true
        }

    },{timestamps:true})
export const Patient =mongoose.model('Patient',PatientSchema)
