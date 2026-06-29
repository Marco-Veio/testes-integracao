import test from "node:test";
import assert from "node:assert/strict";

import { handleErrors } from "./handleErrors";
import { response } from "../../mocks/handleErrors";

test.before(() => {
  console.error = () => {};
});

test("Deve retornar erro 500 para erros desconhecidos", () => {
  handleErrors(new Error("Erro qualquer"), response as any);

  assert.deepStrictEqual(response.statusCode, 500);
  assert.deepStrictEqual(response.body, "Unknown error. Try again later");
});
