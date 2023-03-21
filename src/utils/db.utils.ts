import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async function () {
  try {
    mongoose.set("strictQuery", false);
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    if (connection.readyState == 1) console.log("DB CONNECTED");
  } catch (err) {
    return Promise.reject(err);
  }
};

export default connectDB;
