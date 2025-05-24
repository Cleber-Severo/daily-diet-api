import fastify from "fastify";
import { mealsRoutes } from "./routes/mealsRoutes";
import { userRoutes } from "./routes/userRoutes";

export const app = fastify();

app.register(mealsRoutes, {
  prefix: "/meals",
});

app.register(userRoutes, {
  prefix: "/user",
});
