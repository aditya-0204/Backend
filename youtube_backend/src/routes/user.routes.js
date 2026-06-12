import { Router } from "express";
import registerUser from "../Controllers/user.controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";

const userrouter = Router();

userrouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 },
    ]),
    registerUser
);

export default userrouter;
