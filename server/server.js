import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();

const app=express();

app.use(cors())
app.use(express.json())

const PORT= process.env.PORT || 3000

app.get("/",(req,res)=>{
    res.send("hello world")
    console.log("request")
})

app.listen(PORT,()=>{
    console.log("server online")
})