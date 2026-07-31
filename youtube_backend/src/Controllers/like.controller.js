import mongoose, { mongo } from "mongoose";
import asynchandler from "../utils/asynchandler.js";
import { Like } from "../Models/like.models.js";
import APIError from "../utils/Apierror.js";
import { Video } from "../Models/Video.models.js"
import { Like } from "../Models/like.models.js";
import { Comment } from "../Models/Comment.Models.js"
import { Tweet } from "../Models/tweet.models.js"
import APIresponse from "../utils/Apiresponse.js";

const togglevideolike = asynchandler(async (req, res) => {
    const { videoid } = req.params
    const userId = req.user?._id

    if (!mongoose.Types.ObjectId.isValid(videoid)) { // checking the videoid in the database
        throw new APIError(400, "Invalid video id"); // if not available throw the error
    }

    const video = await Video.findById(videoid);  // extracting the video using videoid

    if (!video) { // if video is not available
        throw new APIError(401, "Video not Found!!");
    }
    const existingLike = await Like.findById({ video: videoid, likedBy: userId });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200)
            .json(
                new APIresponse(200,
                    {
                        isLiked: false
                    },
                    "Video unliked Successfully")
            )
    }

    await Like.create({
        Video: videoid,
        likeBy: userId
    })

    return res.status(200).json(
        new APIresponse(200,
            {
                isLiked: true
            }, "Video liked successfully!!"
        )
    )
});




const toggletweetlike = asynchandler(async (req, res) => {
    const { tweetid } = req.params;
    const userId = req.user?._id

    if (!mongoose.Types.ObjectId.isValid(tweetid)) {
        throw new APIError(400, "tweet id does not exist")
    }
    const tweet = await Tweet.findById(tweetid);
    if (!tweet) {
        throw new APIError(400, "tweet doesn't exist");
    }
    const existingLike = await Like.findOne(
        {
            Tweet: tweetid,
            likeBy: userId
        }
    )

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);

        return status(200)
        .json(
            new APIresponse(200,
                {
                    isLiked:false
                },
                "Tweet unliked successfully"
                
            )
        )
    }
    await Like.create(
        {
            Tweet:tweetid,
            likedBy:userId
        }
    )
    return res.status(200)
    .json(
        new APIresponse(
            200,
            {
                isLiked:true
            },
            "tweet liked successfully"
        )
    )


})
const togglecommentlike = asynchandler(async (req, res) => {
    const { commentid } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(commentid)) {
        throw new APIError(400, "Invalid comment id");
    }

    const comment = await Comment.findById(commentid);
    if (!comment) {
        throw new APIError(400, "Comment not found");
    }

    const existingLike = await Like.findOne({ Comment: commentid, likeBy: userId });
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return status(200).json(
            new APIresponse(200, { isLiked: false }, "Comment unliked Successfully")
        )
    }

    await Like.create({
        Comment: commentid,
        likedBy: userId
    })
    return res.status(200)
        .json(
            new APIresponse(200, { isLiked: true }, "Comment Liked successfully!!")
        )

})
const getlikedvideo = asynchandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const likedVideo = await Like.find({
        likedBy: req.user?._id,
        Video: { $ne: null }
    })
        .populate("Video")
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

    return res.status(200).json(
        new APIresponse(
            200,
            likedVideo,
            "Liked videos fetched successfully"
        )
    );
});
export { togglecommentlike, toggletweetlike, togglevideolike, getlikedvideo }