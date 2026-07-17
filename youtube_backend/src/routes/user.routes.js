import { Router } from "express";
import { changecurrentPassword, getcurrentUser, getUserChannelprofile, getwatchhistory, loginUser, RefreshtheaccessToken, registerUser, updateAvatar, updateUserCoverImage } from "../Controllers/user.controller.js";
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
userrouter.route("/logout").post(verifyJWT, logoutUser)
userrouter.route("/refresh-Token").post(RefreshtheaccessToken)
userrouter.route("/change_password").post(verifyJWT, changecurrentPassword)
userrouter.route("/current-user").get(verifyJWT, getcurrentUser)
userrouter.route("/update-account-details").patch(verifyJWT)/// patch because if we use get it will update all the fields 
userrouter.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
userrouter.route("/coverImage").patch(verifyJWT, upload.single("coverimage"), updateUserCoverImage)

// as we are taking data from req.params
// req. params is used when the data is coming from a url
userrouter.route("/c/:username").get(verifyJWT, getUserChannelprofile)
userrouter.route("/history").get(verifyJWT, getwatchhistory)
export default userrouter;
