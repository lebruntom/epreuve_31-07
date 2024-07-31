const jwt = require("jsonwebtoken");
const request = require("supertest");
const router = require("../app.js");

describe("GET /api/books", () => {
  it("return 200", async () => {
    const response = await request(router)
      .get("/tlebrun/api/books/")
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
  });
});

describe("Post /api/books", () => {
  let csrfToken;

  // Avant chaque test, récupérer un jeton CSRF
  beforeAll(async () => {
    const csrfResponse = await request(router)
      .get("/tlebrun/api/csrf-token")
      .set("Accept", "application/json");

    csrfToken = csrfResponse.body.csrfToken;
  });

  it("return 200", async () => {
    const bookData = {
      title: "test",
      author: "test",
      date_publication: "2024-02-02",
      isbn: "05050505",
      description: "test",
      status: "disponible",
      cover: "test",
    };

    const response = await request(router)
      .post("/tlebrun/api/books/")
      .set("Content-Type", "application/json")
      .set("csrf", csrfToken)
      .send(bookData);

    expect(response.status).toBe(200);

    await request(router)
      .delete(`/tlebrun/api/books/${response.body.insertId}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("csrf", csrfToken);
  });
});
