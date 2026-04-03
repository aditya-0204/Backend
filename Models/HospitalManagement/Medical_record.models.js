import mongoose from "mongoose";
const MedicalRecordSchema = new mongoose.Schema({},{timestamps:true})
export const Medical =mongoose.model('Medical',MedicalRecordSchema)
