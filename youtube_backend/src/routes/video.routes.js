import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware";
import { upload } from "../Middlewares/Multer.middleware";
import { getallvideo } from "../Controllers/video.controller";

const videoRouter = Router();

videoRouter.use(verifyJWT)

videoRouter.route("/").get(getallvideo)