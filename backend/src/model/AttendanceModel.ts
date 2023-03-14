import mongoose from "mongoose";

const Attendance = new mongoose.Schema({
  userId: Number,
  time: Date,
  fullname: String,
});

export default mongoose.model("Attendance", Attendance);
