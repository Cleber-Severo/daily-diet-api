import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.timestamp("updated_at").nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table
      .timestamp("updated_at")
      .defaultTo(knex.fn.now())
      .notNullable()
      .alter();
  });
}
