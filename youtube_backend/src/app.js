import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"


const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
})) //   used for middleware and configuration

app.use(express.json({limit:"20kb"})) // for forms 
app.use(express.urlencoded({extended:true,limit:"20kb"})) // for urls when we search on web sometimes for space %20 is used
app.use(express.static("public")) // public folder on the database to keep files like images
app.use(cookieparser()) // for cookies to keep in the browser securely only read can read these and remove these

export default app;