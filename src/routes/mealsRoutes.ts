import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import crypto, { randomUUID } from "node:crypto";

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);
  });

  app.get("/", async (request, reply) => {
    const meals = await knex("meals").select();

    return reply.status(200).send({ data: meals, message: "Sucess" });
  });

  app.get("/:userId", async (request, reply) => {
    try {
      const listUserMealSchema = z.object({
        userId: z.string().uuid(),
      });

      const { userId } = listUserMealSchema.parse(request.params);

      const userFound = await knex("users").where("id", userId).first();

      if (!userFound) {
        return reply.status(414).send("User not found");
      }

      const userMealsList = await knex("meals")
        .select()
        .where("user_id", userId);

      return reply.status(200).send({ data: userMealsList });
    } catch (err) {
      console.log(err);
      return reply.status(500).send("Internal error");
    }
  });

  app.get("/meal/:mealId", async (request, reply) => {
    try {
      const listUserMealSchema = z.object({
        mealId: z.string().uuid(),
      });

      const { mealId } = listUserMealSchema.parse(request.params);

      const meal = await knex("meals").select().where("id", mealId).first();

      if (!meal) {
        return reply.status(414).send("Meals not found");
      }

      return reply.status(200).send({ data: meal });
    } catch (err) {
      console.log(err);
      return reply.status(500).send("Internal error");
    }
  });

  app.post("/add", async (request, reply) => {
    try {
      const addMealSchema = z.object({
        user: z.string(),
        name: z.string(),
        description: z.string(),
        date: z.string(),
        isOnDiet: z.boolean(),
      });

      const { user, date, description, isOnDiet, name } = addMealSchema.parse(
        request.body
      );

      const userFound = await knex("users").where("id", user).first();

      if (!userFound) {
        return reply.status(414).send("User not found");
      }

      await knex("meals").insert({
        id: crypto.randomUUID(),
        user_id: userFound.id,
        description,
        is_on_diet: isOnDiet,
        name,
        datetime: date,
      });

      return reply.status(201).send("Meal added successfully");
    } catch (error) {
      console.log(" app.post ~ error:", error);
    }
  });

  app.post("/edit", async (request, reply) => {
    try {
      const editMealSchema = z.object({
        mealId: z.string(),
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
      });

      const { mealId, description, isOnDiet, name } = editMealSchema.parse(
        request.body
      );

      await knex("meals")
        .update({
          description,
          is_on_diet: isOnDiet,
          name,
        })
        .where("id", mealId);

      return reply.status(201).send("Meal updated");
    } catch (error) {
      console.log(" app.post ~ error:", error);
    }
  });

  app.post("/delete", async (request, reply) => {
    try {
      const deleteMealSchema = z.object({
        mealId: z.string(),
      });

      const { mealId } = deleteMealSchema.parse(request.body);

      await knex("meals").where("id", mealId).delete();

      return reply.status(201).send("Meal has been removed");
    } catch (error) {
      console.log(" app.post ~ error:", error);
    }
  });
}
