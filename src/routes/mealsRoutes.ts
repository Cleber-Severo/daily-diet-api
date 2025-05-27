import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import crypto, { randomUUID } from 'node:crypto'


export async function mealsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);
  });

  app.get("/", async (request, reply) => {
    const meals = await knex('meals').select()

    return reply.status(200).send({ data: meals, message: 'Sucess' });
  });

  app.post('/add', async (request, reply) => {
    try {
      const createUserSchema = z.object({
        user: z.string(),
        name: z.string(),
        description: z.string(),
        date: z.string(),
        isOnDiet: z.boolean()
      });

      const { user, date, description, isOnDiet, name } = createUserSchema.parse(request.body);


      const userFound = await knex('users').where('id', user).first()

      if (!userFound) {
        return reply.status(414).send("User not found");
      }

      await knex('meals').insert({
        id: crypto.randomUUID(),
        user_id: userFound.id,
        description,
        is_on_diet: isOnDiet,
        name,
        datetime: date
      })

      return reply.status(201).send("Meal added successfully");
    } catch (error) {
      console.log(" app.post ~ error:", error)
    }
  })
}
