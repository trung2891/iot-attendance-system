import express from "express";
import { CONFIG } from "./config/config";
import userRoute from "./routes/user";
import attendanceRoute from "./routes/attendance";
import mongoose from "mongoose";
import { MONGOOSE } from "./config/config";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

userRoute(app);
attendanceRoute(app);
app.listen(CONFIG.PORT, () => {
  console.info(`Server running at http://localhost:${CONFIG.PORT}`);
});

mongoose
  .connect(MONGOOSE.MONGO_URL, { retryWrites: true, w: "majority" })
  .then(() => {
    console.info("Connected to mongoDB.");
  })
  .catch((error) => {
    console.error("Unable to connect.");
    console.error(error);
  });
