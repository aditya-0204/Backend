import { Router } from "express";
import registerUser from "../Controllers/user.controller";
const userrouter = Router()

userrouter.route("/register").post(registerUser)
export default userrouter;