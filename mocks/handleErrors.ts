export const response = {
  statusCode: 0,
  body: "",

  status(code: number) {
    this.statusCode = code;
    return this;
  },

  json(body: string) {
    this.body = body;
    return this;
  },
};
