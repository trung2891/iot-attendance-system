import mongoose from "mongoose";

const User = new mongoose.Schema({
  id: String,
  username: String,
  fullname: String,
  email: String,
  role: String,
  isDeleted: Boolean,
});

export default mongoose.model("User", User);
