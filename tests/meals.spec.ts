import { describe } from "node:test";
import { afterAll, afterEach, beforeAll, beforeEach, it } from "vitest";
import { app } from "../src/app";
import { execSync } from "child_process";
import request from "supertest";
import path from "path";
import fs from "fs";

describe("Meals Routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  const DB_PATH = path.resolve(__dirname, "../../db/test.db");

  beforeEach(() => {
    // Apaga o arquivo SQLite para banco limpo
    if (fs.existsSync(DB_PATH)) {
      fs.unlinkSync(DB_PATH);
    }

    // Executa as migrations
    execSync("npm run knex migrate:latest");
  });

  it("should list all meals", async () => {
    await request(app.server).get("/meals").expect(200);
  });

  it("should create a new meal", async () => {
    await request(app.server).post("/user").send({
      name: "Clébão",
    });

    const userList = await request(app.server).get("/user");
    const userId = userList.body.data.users[0].id;

    await request(app.server)
      .post("/meals/add")
      .send({
        name: "Janta",
        user: userId,
        date: "2025-05-27 18:00",
        description: "TESTE",
        isOnDiet: true,
      })
      .expect(201);
  });

  it("should list an specific meal", async () => {
    await request(app.server).post("/user").send({
      name: "Clébão",
    });

    const userList = await request(app.server).get("/user");
    const userId = userList.body.data.users[0].id;

    await request(app.server)
      .post("/meals/add")
      .send({
        name: "Janta",
        user: userId,
        date: "2025-05-27 18:00",
        description: "TESTE",
        isOnDiet: true,
      })
      .expect(201);

    const mealsList = await request(app.server).get("/meals").expect(200);
    const firstMealId = mealsList.body.data[0].id;

    await request(app.server).get(`/meals/meal/${firstMealId}`).expect(200);
  });
});
