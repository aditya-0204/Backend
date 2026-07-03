import { Router } from "express";
import { loginUser,RefreshtheaccessToken,registerUser } from "../Controllers/user.controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";
 import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { logoutUser } from "../Controllers/user.controller.js";
 const userrouter = Router();

userrouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 },
    ]),
    registerUser
);

userrouter.route("/login").post(loginUser)

//secured routes
userrouter.route("/logout").post(verifyJWT,logoutUser)
userrouter.route("/refresh-Token").post(RefreshtheaccessToken)

export default userrouter;
