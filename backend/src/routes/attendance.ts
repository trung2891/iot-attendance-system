import {
  createAttendance,
  getAllAttendances,
  getAllAttendancesByUser,
  getAllUserAttendanceInMonth,
  getAttendanceBetween,
  getAttendanceBetweenByUserId,
  getAttendanceUserByDate,
  getUserAttendanceInMonth,
} from "../controler/AttendanceController";

export default async (app: any) => {
  app.use((req: any, res: any, next: any) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/attendances", getAllAttendances);
  app.post("/attendances", createAttendance);
  app.get("/attendances/user/:userId", getAllAttendancesByUser);
  app.get("/attendances/between", getAttendanceBetween);
  app.get("/attendances/user/:userId/between", getAttendanceBetweenByUserId);
  app.get("/attendances/user/:userId/date", getAttendanceUserByDate);
  app.get("/attendances/month", getAllUserAttendanceInMonth);
  app.get("/attendances/user/:userId/month", getUserAttendanceInMonth);
};
