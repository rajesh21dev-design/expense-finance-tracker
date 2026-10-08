import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./config/db.js";

dotenv.config();

const app=express();

connectDB()

app.use(cors())
app.use(express.json())

const PORT= process.env.PORT || 3000

app.get("/",(req,res)=>{
    res.send("hello world")
    console.log("request")
})

app.listen(PORT,()=>{
    console.log("server running on port 3000")
})