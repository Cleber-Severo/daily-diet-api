import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").primary();
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("name").notNullable();
    table.text("description").notNullable();
    table.timestamp("datetime").notNullable();
    table.boolean("is_on_diet").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
