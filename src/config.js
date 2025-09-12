// config.js
import dotenv from "dotenv";

dotenv.config();

export const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 8000,
};
