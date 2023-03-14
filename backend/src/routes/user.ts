import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  getUserByUsername,
  updateUser,
} from "../controler/UserController";

export default async (app: any) => {
  app.use((req: any, res: any, next: any) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/users", getAllUser);
  app.post("/users", createUser);
  app.get("/users/:id", getUserById);
  app.delete("users/:id", deleteUser);
  app.put("/users", updateUser);
};
