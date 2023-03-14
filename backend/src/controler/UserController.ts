import { Request, Response } from "express";
import {
  createNewUser,
  deleteUserByIdOrUsername,
  getAllUsers,
  readUserById,
  readUserByUsername,
  updateUserById,
} from "../service/UserService";
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, fullname, email, role } = req.body;
    if (
      username == undefined ||
      fullname == undefined ||
      email == undefined ||
      role == undefined
    ) {
      res.status(400).send("id or name or email or role is null!!!");
      return;
    }
    let user = await createNewUser(username, fullname, email, role);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).send(users);
    console.log(users);
  } catch (err) {
    console.log(err);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await readUserById(userId);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const user = await readUserByUsername(username);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (id == undefined) {
      res.status(400).send("Bad request");
      return;
    }
    await deleteUserByIdOrUsername(id);
    res.status(200).send("delete successfull!!");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id, username, fullname, email, role } = req.body;
    if (
      username == undefined ||
      fullname == undefined ||
      email == undefined ||
      id == undefined ||
      role == undefined
    ) {
      res.status(400).send("id or name or email or role is null!!!");
      return;
    }
    let user = await updateUserById(id, username, fullname, email, role);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
