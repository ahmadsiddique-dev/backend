// require('dotenv').config({path : "./env"});

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";


connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is live on ${process.env.PORT || 8000}`)
  })
})
.catch((error) => {
  console.log("MDB connection failed : ", error);
})





/*
import express from "express";
const app = express();

(async () => {
  try {
    const response = await mongoose.connect(
      `mongodb+srv://saif:saif123@cluster0.wcnmcel.mongodb.net/mango`
    );
    console.log("connection was successful.");
    const db = response.connection.db;
    let myData = db.collection("mango");
    // console.log("Response : ", response);
    app.get("/", async (req, res) => {
      let docs = await myData.find({}).toArray();
      res.json({
        Docs: docs,
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
      });
    });
    let port = 8000;
    app.listen(port, () => {
      console.log(`App is listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("CONNECTION ERROR : ", error);
  }
})(); 
*/
