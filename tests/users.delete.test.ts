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

test("Deve deletar um usuário", async () => {
  const user = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
  });

  const response = await request(app).delete(`/users/${user.id}`);

  assert.deepStrictEqual(response.status, 200);
  assert.deepStrictEqual(response.body, user);
});

test("Deve remover o usuário do banco após delete", async () => {
  const user = await prisma.user.create({
    data: {
      name: "Marco",
      email: "marco@email.com",
    },
  });

  await request(app).delete(`/users/${user.id}`);

  const check = await prisma.user.findUnique({
    where: { id: user.id },
  });

  assert.deepStrictEqual(check, null);
});

test("Deve retornar 404 ao deletar usuário inexistente", async () => {
  const response = await request(app).delete("/users/9999");

  assert.deepStrictEqual(response.status, 404);
});

test("Deve deletar apenas o usuário correto", async () => {
  const user1 = await prisma.user.create({
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

  await request(app).delete(`/users/${user1.id}`);

  const remaining = await prisma.user.findMany();

  assert.deepStrictEqual(remaining.length, 1);
  assert.deepStrictEqual(remaining[0].id, user2.id);
});
