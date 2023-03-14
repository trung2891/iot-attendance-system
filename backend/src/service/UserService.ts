import User from "../model/UserModel";

export const createNewUser = async (
  username: String,
  fullname: String,
  email: String,
  role: String
) => {
  let user = await User.findOne({ username: username });
  if (user) {
    throw "username has already exist";
  }

  // let max_user = await User.find().sort({ id: -1 }).limit(1);
  let users = await User.find();
  let max_id: number = 0;
  for (let index in users) {
    max_id = Math.max(max_id, Number(users[index].id));
  }

  user = new User({
    id: max_id + 1,
    username,
    fullname,
    email,
    role,
  });

  await user.save();

  return user;
};

export const getAllUsers = async () => {
  const users = await User.find();

  return users;
};

export const readUserById = async (userId: String) => {
  const user = await User.findOne({ id: userId });

  if (!user) {
    throw "User not found";
  }

  return user;
};

export const readUserByUsername = async (username: String) => {
  const user = await User.findOne({ username: username });

  if (!user) {
    throw "User not found";
  }

  return user;
};

export const deleteUserByIdOrUsername = async (id: String) => {
  const user = await User.findOne({
    $or: [{ id: id }, { username: id }],
  });

  if (!user) {
    throw "User not found";
  }

  user.isDeleted = false;
  await user.save();
  // await user.delete();
};

export const updateUserById = async (
  id: number,
  username: string,
  fullname: string,
  email: string,
  role: string
) => {
  let user = await User.findOne({ id: id });

  if (!user) {
    throw "User not found";
  } else {
    let other = await User.findOne({ username: username });
    if (other && other.id != user.id) {
      throw "Username has taken by other user";
    }
    user.id = id;
    user.username = username;
    user.fullname = fullname;
    user.email = email;
    user.role = role;
  }

  await user.save();
  return user;
};
