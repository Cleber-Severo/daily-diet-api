import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { app } from "../src/app";
import { execSync } from "child_process";
import request from "supertest";
import path from "path";
import fs from "fs";

describe("Users Routes", () => {
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

  it("should create a new user", async () => {
    await request(app.server)
      .post("/user")
      .send({
        name: "Clébão",
      })
      .expect(201);
  });

  it("shoud list all user meals", async () => {
    await request(app.server).get("/user").expect(200);

    // const list = request(app.server).get('/user').expect(200);
    // const  userId = list.data.user.id
  });
});
