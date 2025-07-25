import dotenv from 'dotenv';
import DBConection from './db/db.js';
import { app } from './app.js';


dotenv.config({
    path: './env'
})

 
DBConection()
.then(() => {
    app.listen(process.env.PORT ||8000, ()=>{
        console.log(` Server is running at port : ${process.env.PORT}`)
    }) 
})
.catch((error) =>{
    console.error("Mongo db connection failed !!",error);
})
















// import express from "express";
// const app = express()

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error", (error) =>{
//             console.log("Error",error);
//             throw error
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`application is running on port ${process.env.PORT}`)
//         })
// } catch (error) {
//     console.error("Error", error)
//         throw error
    
// }
// })()