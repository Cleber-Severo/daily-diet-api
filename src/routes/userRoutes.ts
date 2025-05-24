import { FastifyInstance } from "fastify";

export async function userRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);
  });

  app.get("/", async (request, reply) => {
    return reply.status(201).send("sucesso na sua primeira rota de usuários");
  });
}
