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

test("Deve listar os usuários", async () => {
  const user = await prisma.user.create({
    data: {
      name: faker.person.firstName(),
      email: faker.internet.email(),
    },
  });

  const response = await request(app).get("/users");

  assert.deepStrictEqual(response.status, 200);
  assert.deepStrictEqual(response.body.length, 1);
  assert.deepStrictEqual(response.body[0], user);
});

test("Deve retornar uma lista vazia quando não houver usuários", async () => {
  const response = await request(app).get("/users");

  assert.deepStrictEqual(response.status, 200);
  assert.deepStrictEqual(response.body, []);
});

test("Deve listar vários usuários", async () => {
  await prisma.user.createMany({
    data: [
      {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      },
      {
        email: faker.internet.email(),
      },
      {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      },
    ],
  });

  const response = await request(app).get("/users");

  assert.deepStrictEqual(response.status, 200);
  assert.deepStrictEqual(response.body.length, 3);
  response.body.forEach((user: any) => {
    assert.ok(user.email);
    assert.ok(user.id);
  });
});
