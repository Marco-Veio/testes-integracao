import { Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import prismaErrorCodes from "../../config/prismaErrorCodes.json";

export function handleErrors(e: unknown, response: Response) {
  console.error(e);
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return (
      response
        .status(
          prismaErrorCodes[e.code as keyof typeof prismaErrorCodes] ?? 500,
        )
        .json(e.message.split("\n").pop())
    );
  }
  return response.status(500).json("Unknown error. Try again later");
}
