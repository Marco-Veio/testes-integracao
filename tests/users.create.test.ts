import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app";
import { prisma } from "../config/prisma";
import { faker } from "@faker-js/faker";

test.before(() => {
  console.error = () => {};
});

test.beforeEach(async () => {
  await prisma.user.deleteMany();
});

test.after(async () => {
  await prisma.$disconnect();
});

test("Deve cadastrar um usuário", async () => {
  const user = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
  };
  const response = await request(app).post("/users").send(user);

  assert.deepStrictEqual(response.status, 201);
  assert.deepStrictEqual(response.body.name, user.name);
  assert.deepStrictEqual(response.body.email, user.email);
  assert.ok(response.body.id);
});

test("Deve retornar erro se o email não for informado", async () => {
  const response = await request(app).post("/users").send({
    name: faker.person.firstName(),
  });

  assert.deepStrictEqual(response.status, 400);
  assert.deepStrictEqual(response.body, "User data incomplete");
});

test("Deve permitir cadastrar usuário sem nome", async () => {
  const response = await request(app).post("/users").send({
    email: "semnome@email.com",
  });

  assert.deepStrictEqual(response.status, 201);
  assert.deepStrictEqual(response.body.name, null);
  assert.deepStrictEqual(response.body.email, "semnome@email.com");
});

test("Deve retornar erro ao cadastrar um email duplicado", async () => {
  await request(app).post("/users").send({
    name: "Marco",
    email: "duplicado@email.com",
  });

  const response = await request(app).post("/users").send({
    name: "Outro",
    email: "duplicado@email.com",
  });

  assert.deepStrictEqual(response.status, 409);
  assert.match(response.text, /Unique constraint failed/);
});
