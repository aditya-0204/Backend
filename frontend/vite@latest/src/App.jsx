import { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
function App() {
  let [jokes,setjokes] = useState([])
  let [counter,setcounter] = useState(0)
  
  useEffect(()=>{
    axios.get('/api/jokes')
    .then((response)=>{
      setjokes(response.data)
    })
    .catch((err)=>{
      console.log(err);
      
    })
  })
  
  const add = ()=>{
    setcounter(counter+1)
  }
  return (
    <>
    <h1>Chai aur full stack</h1>
    <p>Total jokes: {jokes.length}</p>
    {
      
      jokes.map((joke)=>(
        <div>
          <div>
            {
              joke.id
            }
          </div>
          <div>{joke.content}</div>
        </div>
      ))
    }
    <button onClick={add}>add</button>
    <p>counter: {counter}</p>


    </>
  )

}
export default App

import mongoose from 'mongoose';
const userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase:true
  },
  email:{
    type:String,
    required:true,
    unique: true,
    lowercase:true

  },
  password:{
    type:String,
    required: [true,"password is required"],
  },
  isactive : Boolean
},
{
  timestamps: true
}
)
export const User = mongoose.model("User",userschema)
