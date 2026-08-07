import mongoose, { mongo } from "mongoose";
import asynchandler from "../utils/asynchandler.js";
import { Playlist } from "../Models/Playlist.models.js";
import { Video } from "../Models/Video.models.js";
import APIError from "../utils/Apierror.js";
import APIresponse from "../utils/Apiresponse.js";


const createPlaylist = asynchandler(async (req, res) => {
    const { name, description } = req.body
    if (!name?.trim() || !description?.trim()) {
        throw new APIError(400, "Name and description are required");
    }

    const playlist = await Playlist.create({
        name: name?.trim(),
        description: description?.trim(),
        owner: req.user?._id,
        videos: []
    })

    return res.status(200)
        .json(new APIresponse(200, playlist, "Playlist created successfully"));
})


const getUserplaylists = asynchandler(async (req, res) => {
    const { userid } = req.params
    if (!mongoose.Types.ObjectId.isValid(userid)) {
        throw new APIError(400, "Invalid user id");
    }
    const playlists = await Playlist.find({ owner: userid })
        .populate("videos")
        .populate("owner", "username email Fullname avatar")


    return res.status(200)
        .json(new APIresponse(200, playlists, "User playlist fetched Successfully"))
})


const getplaylistbyid = asynchandler(async (req, res) => {
    const { playlistid } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistid)) {
        throw new APIError(400, "Invalid playlist id");
    }
    const playlist = await Playlist.findById(playlistid).populate("videos")
        .populate("owner", "username email Fullname avatar");

    if (!playlist) {
        throw new APIError(404, "Playlist not found");
    }

    return res.status(200).json(new APIresponse(200, playlist, "playlist fetched successfully"));
})


const addvideotoPlaylist = asynchandler(async (req, res) => {
    const { playlistid, videoid } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistid)) {
        throw new APIError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistid);
    if (!playlist) {
        throw new APIError(404, "Playlist not found");

    }
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new APIError(403, "You are not allowed to modify the playlist");
    }

    if (!mongoose.Types.ObjectId.isValid(videoid)) {
        throw new APIError(400, "Videoid is not valid");
    }
    const video = await Video.findById(videoid)
    if (!video) {
        throw new APIError(404, "Video is not available");
    }
    const alreadyexist = await Playlist.findOne({
        _id: playlistid,
        videos: videoid
    })
    if (alreadyexist) {
        throw new APIError(404, "video already exist in the playlist");
    }
    playlist.videos.push(videoid);

    await playlist.save();

    const updatePlaylist = await Playlist.findById(playlistid)
        .populate("videos")
        .populate("owner", "username email Fullname avatar");

    return res.status(200)
        .json(new APIresponse(
            200,
            updatePlaylist,
            "Video has been added successfully"
        ))

})
const deletevideofromplaylist = asynchandler(async (req, res) => {

    const { playlistid, videoid } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistid)) {
        throw new APIError(400, "Invalid playlist id");
    }

    if (!mongoose.Types.ObjectId.isValid(videoid)) {
        throw new APIError(401, "Invalid video id")
    }

    const playlist = Playlist.findOne({
        _id: playlistid,
        owner: req.user?._id
    })
    if (!playlist) {
        throw new APIError(404, "Playlist not found or you are not the owner");
    }
    await Playlist.findByIdAndUpdate(playlistid,
        {
            $pull: {
                videos: videoid
            }
        },
        { new: true }
    )

    await playlist.save();
    const updatePlaylist = await Playlist.findById(playlistid)
        .populate("videos")
        .populate("owner", "username email Fullname avatar")

    return res.status(200)
        .json(new APIresponse(200, updatePlaylist, "video removed successfully from the playlist"))

})
const updateplaylist = asynchandler(async (req, res) => {
    const { name, description } = req.body
    const { playlistid } = req.params
    if (!mongoose.Types.ObjectId.isValid(playlistid)) {
        throw new APIError(404, "Playlist id is not valid");

    }
    const playlist = Playlist.findById(playlistid)
    if (!playlist) {
        throw new APIError("playlist not found");

    }
    if (!name?.trim() && !description?.trim()) {
        throw new APIError(404, "Either name or description is required");
    }

    if (name?.trim()) {
        playlist.name = name.trim();
    }
    if (description?.trime()) {
        playlist.description = description.trim();
    }
    await playlist.save();

    const updatePlaylist = await Playlist.findById(playlistid)
        .populate("videos")
        .populate("owner", "name Fullname email avatar");

    return res.status(200)
        .json(new APIresponse(200, updatePlaylist, "Playlist updated successfully"))

})
const deleteplaylist = asynchandler(async (req, res) => {

    const { playlistid } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistid)) {
        throw new APIError(400, "Invalid playlist id ");
    }

    const playlist = await Playlist.findOne({
        _id: playlistid,
        owner: req.user?._id
    })
    if (!playlist) {
        throw new APIError(404, "Playlist not found or you are not the owner");
    }

    await Playlist.findByIdAndDelete(playlistid);

    return res.status(200)
        .json(new APIresponse(200, {}, "Playlist deleted successfully"))

})
export { deleteplaylist, updateplaylist, deletevideofromplaylist, addvideotoPlaylist, createPlaylist, getUserplaylists, getplaylistbyid }
