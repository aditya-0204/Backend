import * as dotenv from 'dotenv';
dotenv.config();
// require('dotenv').config()

import express from 'express';
const app  = express();

app.get('/',(req,res)=>{
    res.send('server is ready');
});

app.get('/api/jokes',(req,res)=>{
    const joke = [
        {
            "id":1,
            "content":"First Joke"
        },
        {
            "id":2,
            "content":"second Joke"
        },
        {
            "id":3,
            "content":"third Joke"
        }
    ]
    res.send(joke);
});

app.get('/aditya',(req,res)=>{
    res.send('<h1>Aditya</h1>');
})
app.listen(process.env.PORT,()=>{
    console.log('server is ready');
    
});