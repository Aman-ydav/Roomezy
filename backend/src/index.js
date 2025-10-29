import {app} from "./app.js";
import connectDB from "./db/index.js";
import "./config.js";

connectDB()
.then(()=>{
        app.on("error", (err)=>{
            console.log("Error on App:", err);
            throw err;
        });
        app.listen(process.env.PORT || 3000, ()=>{
            console.log(`App is listening on ${process.env.PORT || 3000}`);
        })
})
.catch((err)=>{
    console.log("MONGODB Connection not done", err);
    throw err;
})




















/*
import express from "express";
const app = express();

;(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (err)=>{
            console.log("Error:", err);
            throw err;
        });
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on ${process.env.PORT}`);
        })
    }
    catch(err){
        console.log("Error:", err);
        throw err;
    }
})()
*/