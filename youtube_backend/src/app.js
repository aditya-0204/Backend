import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"


const app = express()
app.use(cors({ // use  is used for middleware and configuration    
    origin:process.env.CORS_ORIGIN,
    credentials:true
})) //   used for middleware and configuration

app.use(express.json({limit:"20kb"})) // for forms 
app.use(express.urlencoded({extended:true,limit:"20kb"})) // for urls when we search on web sometimes for space %20 is used
app.use(express.static("public")) // public folder on the database to keep files like images
app.use(cookieparser()) // for cookies to keep in the browser securely only read can read these and remove these


// routes import 
import userrouter from "./routes/user.routes.js"
import registerUser from "./Controllers/user.controller.js"


//routes declaration
// we cannot use "app.get" because we have separated the model, controller and routes
// so we have to use middleware and to use middleware we have to use app.use
 
app.use("/api/v1/users",userrouter)

export default app;