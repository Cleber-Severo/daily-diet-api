import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import crypto, { randomUUID } from "node:crypto";

export async function userRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);
  });

  app.get("/", async (request, reply) => {
    try {
      const users = await knex('users').select()

      return reply.status(200).send({ data: { users }, message: "Success on listing users" });
    } catch (error) {
      console.log(" app.post ~ error:", error);
      return reply.status(500).send("An error has ocurred");
    }
  });

  app.post("/", async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
    });

    const { name } = createUserSchema.parse(request.body);

    try {
      await knex("users").insert({
        id: crypto.randomUUID(),
        name,
      });

      return reply.status(201).send("User has been created successfully");
    } catch (error) {
      console.log(" app.post ~ error:", error);
      return reply.status(500).send("An error has ocurred");
    }
  });
}
