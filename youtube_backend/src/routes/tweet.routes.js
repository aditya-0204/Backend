import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

import { createTweet,deletetweet,updateTweet,getusertweets } from "../Controllers/Tweet.controller.js";

const tweetrouter = Router()

tweetrouter.use(verifyJWT);

tweetrouter.route("/user/:userid").get(getusertweets)
tweetrouter.route("/:tweetid").delete(deletetweet)
tweetrouter.route("/:tweetid").patch(updateTweet)
tweetrouter.route("/").post(createTweet)