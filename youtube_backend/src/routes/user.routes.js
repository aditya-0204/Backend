import { Router } from "express";
import registerUser from "../Controllers/user.controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import APIError from "../utils/Apierror.js";
const userrouter = Router()

userrouter.route("/register").post(
    upload.fields([
        {name:"avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser
)
export default userrouter;