import { Router } from "express";

import usersController from "./controllers/users";

const routes = Router();

routes.get("/", (request, response) =>
  response.status(200).json({ success: true }),
);

routes.get("/users", usersController.list);
routes.get("/users/:id", usersController.getById);
routes.post("/users", usersController.create);
routes.put("/users/:id", usersController.update);
routes.delete("/users/:id", usersController.delete);

export default routes;
