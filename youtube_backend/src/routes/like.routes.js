import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
    getlikedvideo,
    togglecommentlike,
    toggletweetlike,
    togglevideolike,
} from "../Controllers/like.controller.js";

const likerouter = Router();

likerouter.use(verifyJWT);

likerouter.route("/videos").get(getlikedvideo);
likerouter.route("/video/:videoid").post(togglevideolike);
likerouter.route("/comment/:commentid").post(togglecommentlike);
likerouter.route("/tweet/:tweetid").post(toggletweetlike);

export default likerouter;
