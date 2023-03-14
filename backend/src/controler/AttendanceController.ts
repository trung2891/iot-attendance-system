import { Request, Response } from "express";
import {
  addAttendance,
  readAllAttendances,
  readAllUsersAttendanceInMonth,
  readAttendancesBetween,
  readAttendancesBetweenByUserId,
  readAttendancesUserByDate,
  readdAttendancesByUser,
  readUserAttendanceInMonth,
} from "../service/AttendanceService";

export const createAttendance = async (req: Request, res: Response) => {
  const { userId, time } = req.body;

  try {
    if (userId == undefined || time == undefined) {
      res.status(400).send("UserId or time is null");
      return;
    }

    let r = await addAttendance(userId, time);
    res.status(200).send(r);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
    return;
  }
};

export const getAllAttendances = async (req: Request, res: Response) => {
  try {
    const attendances = await readAllAttendances();
    res.status(200).send(attendances);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
    return;
  }
};

export const getAllAttendancesByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const attendances = await readdAttendancesByUser(userId);
    res.status(200).send(attendances);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
    return;
  }
};

export const getAttendanceBetween = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    if (from == undefined || to == undefined) {
      res.status(400).send("from or to is null");
      return;
    }
    const attendances = await readAttendancesBetween(from, to);
    res.status(200).send(attendances);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
    return;
  }
};

export const getAttendanceBetweenByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const { from, to } = req.query;
    const { userId } = req.params;

    if (from == undefined || to == undefined) {
      res.status(400).send("from or to is null");
      return;
    }
    const attendances = await readAttendancesBetweenByUserId(userId, from, to);
    res.status(200).send(attendances);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
    return;
  }
};

export const getAttendanceUserByDate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    console.log(userId, date);
    if (userId == undefined || date == undefined) {
      res.status(400).send("userID or date is null");
      return;
    }

    const attendances = await readAttendancesUserByDate(Number(userId), date);
    res.status(200).send(attendances);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
    return;
  }
};

export const getUserAttendanceInMonth = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (userId == undefined) {
      res.status(400).send("userID is null");
      return;
    }
    const response = await readUserAttendanceInMonth(userId);
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
    return;
  }
};

export const getAllUserAttendanceInMonth = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await readAllUsersAttendanceInMonth();
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
    return;
  }
};
