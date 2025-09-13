import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser())

// Routes import 
import userRouter from "./routes/user.routes.js"


// Route Decleration
app.use("/api/v1/users", userRouter)
export { app };

