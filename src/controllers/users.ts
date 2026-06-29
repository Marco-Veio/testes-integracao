import { Request, Response } from "express";

import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

export default {
  create: async (request: Request, response: Response) => {
    try {
      const { email, name } = request.body;

      if (!email) {
        return response.status(400).json("User data incomplete");
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
        },
      });
      return response.status(201).json(user);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  list: async (request: Request, response: Response) => {
    try {
      const users = await prisma.user.findMany();
      return response.status(200).json(users);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  getById: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      const user = await prisma.user.findUnique({
        where: {
          id: +id,
        },
      });

      if (!user) {
        return response.status(404).json("User not found");
      }

      return response.status(200).json(user);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  update: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { name, email } = request.body;

      const user = await prisma.user.update({
        data: {
          name,
          email,
        },
        where: { id: +id },
      });

      return response.status(200).json(user);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  delete: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      const user = await prisma.user.delete({
        where: {
          id: +id,
        },
      });

      return response.status(200).json(user);
    } catch (e) {
      return handleErrors(e, response);
    }
  },
};
