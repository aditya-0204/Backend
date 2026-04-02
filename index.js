const express = require('express')
require('dotenv').config()
const app = express()

const port = 4000

app.get("/",(req,res)=>{
    res.send('<h1>You CAN do IT')
})

app.listen(process.env.PORT,()=>{
    console.log("hey you are at port 4000")
})