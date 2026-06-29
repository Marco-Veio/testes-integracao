import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { faker } from "@faker-js/faker";

import app from "../src/app";
import { prisma } from "../config/prisma";

test.before(() => {
  console.error = () => {};
});

test.beforeEach(async () => {
  await prisma.user.deleteMany();
});

test.after(async () => {
  await prisma.$disconnect();
});

test("Deve atualizar um usuário", async () => {
  const user = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
  });

  const response = await request(app).put(`/users/${user.id}`).send({
    name: "Novo Nome",
    email: "novo@email.com",
  });

  assert.deepStrictEqual(response.status, 200);
  assert.deepStrictEqual(response.body.name, "Novo Nome");
  assert.deepStrictEqual(response.body.email, "novo@email.com");
});

test("Deve atualizar apenas o nome do usuário", async () => {
  const user = await prisma.user.create({
    data: {
      name: faker.person.firstName(),
      email: faker.internet.email(),
    },
  });

  const response = await request(app).put(`/users/${user.id}`).send({
    name: "Nome Atualizado",
  });

  assert.deepStrictEqual(response.status, 200);
  assert.deepStrictEqual(response.body.name, "Nome Atualizado");
  assert.deepStrictEqual(response.body.email, user.email);
});

test("Deve retornar 404 ao atualizar usuário inexistente", async () => {
  const response = await request(app).put("/users/99999").send({
    name: "Qualquer Nome",
  });

  assert.deepStrictEqual(response.status, 404);
});

test("Deve retornar erro ao atualizar com email já existente", async () => {
  await prisma.user.create({
    data: {
      name: "User 1",
      email: "user1@email.com",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "User 2",
      email: "user2@email.com",
    },
  });

  const response = await request(app).put(`/users/${user2.id}`).send({
    email: "user1@email.com",
  });

  assert.deepStrictEqual(response.status, 409);
});
