import Attendance from "../model/AttendanceModel";
import User from "../model/UserModel";
import { addOneDay, firstDayOfMonth, lastDayOfMonth } from "../utils/time";
import { readUserById } from "./UserService";

export const addAttendance = async (userId: Number, time: Date) => {
  const attendance = new Attendance({
    userId,
    time,
  });

  const user = await readUserById(String(userId));
  attendance.fullname = (await user).fullname;

  await attendance.save();
  return attendance;
};

export const readAllAttendances = async () => {
  const attendances = await Attendance.find().sort({ time: -1 });
  return attendances;
};

export const readdAttendancesByUser = async (userId: String) => {
  const attendances = await Attendance.find({ userId: userId }).sort({
    time: -1,
  });
  return attendances;
};

export const readAttendancesBetween = async (from: any, to: any) => {
  const attendances = await Attendance.find({
    time: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
  }).sort({ time: -1 });
  return attendances;
};

export const readAttendancesBetweenByUserId = async (
  userId: any,
  from: any,
  to: any
) => {
  const attendances = await Attendance.find({
    $and: [
      { userId: userId },
      {
        time: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      },
    ],
  }).sort({ time: -1 });
  return attendances;
};

export const readAttendancesUserByDate = async (userId: any, date: any) => {
  const from = new Date(date);

  const to = addOneDay(new Date(date));
  const attendances = await Attendance.find({
    $and: [
      { userId: userId },
      {
        time: {
          $gte: from,
          $lte: to,
        },
      },
    ],
  }).sort({ time: -1 });

  return attendances;
};

export const readUserAttendanceInMonth = async (userId: any) => {
  const user = readUserById(userId);
  let start: any = firstDayOfMonth();
  let end: any = new Date();

  let attendances = await readAttendancesBetweenByUserId(userId, start, end);
  let dates: any = [];
  for (let index in attendances) {
    dates.push(attendances[index].time);
  }
  const uniqueDates = [
    ...new Set(dates.map((date: any) => date.toISOString().slice(0, 10))),
  ];
  const count = uniqueDates.length;

  return {
    id: userId,
    username: (await user).username,
    fullname: (await user).fullname,
    numDay: count,
  };
};

export const readAllUsersAttendanceInMonth = async () => {
  const users = await User.find();
  const responses: any = [];
  for (let index in users) {
    const res = {
      id: users[index].id,
      fullname: users[index].fullname,
      username: users[index].username,
      numDay: (await readUserAttendanceInMonth(users[index].id)).numDay,
    };

    responses.push(res);
  }

  return responses;
};
