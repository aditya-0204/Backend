import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler.js";
import APIError from "../utils/Apierror.js";
import APIresponse from "../utils/Apiresponse.js";
import { Subscription} from "../Models/Subscription.models.js";
import { User } from "../Models/User.models.js";
const togglesubscripton = asynchandler(async (req, res) => {
    const { channelid } = req.params
    if (!mongoose.Types.ObjectId.isValid(channelid)) {
        throw new APIError(400, "Invalid channel id")
    }
    const channel = await User.findById(channelid)
    if (!channel) {
        throw new APIError(400, "channel does not exist")
    }
    let subscribed;
    const issubscribed = await Subscription.findOne({
        channel: channelid,
        subscriber: req.user?._id
    })
    if (issubscribed) {
        await Subscription.deleteOne({
            channel: channelid,
            subscriber: req.user?._id
        })
        subscribed = false;
    }
    else {
        await Subscription.create({
            channel: channelid,
            subscriber: req.user._id
        });
        subscribed = true;
    }
    return res.status(200)
    .json(new APIresponse(200,{subscribed:false},"Channel subscribed successfully"))

})
const getUserChannelSubscription = asynchandler(async (req, res) => {
    const {channelid} = req.params
    if(!mongoose.Types.ObjectId.isValid(channelid)){
        throw new APIError(400,"Invalid channel id");
    }
    const Subscription  = await Subscription.find({channel:channelid})
    .populate("subscriber","username email Fullname avatar")
    .sort({createdAt:-1});
    return res.status(200)
    .json(new APIresponse(200,Subscription,"Channel subscribers fetched successfully"));
})
const getSubscribedChannels = asynchandler(async (req, res) => {
    const {subscriberid}= req.params
    if(!mongoose.Types.ObjectId.isValid(subscriberid)){
        throw new APIError(400,"Invalid subsriber id")
    }

    const subscribedChannels = await Subscription.find({subscriber:subscriberid})
    .populate("channel","username email Fullname avatar")
    .sort({createdAt:-1})

    return status(200)
    .json(new APIresponse(200,subscribedChannels,"Subscribed channels fetched successfully"))
});

export { togglesubscripton, getUserChannelSubscription, getSubscribedChannels }