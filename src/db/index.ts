import { DB } from "kysely-codegen";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "@neondatabase/serverless";

const db = new Kysely<DB>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: `${DATABASE_URL}?sslmode=require&options=project%3Dep-winter-tree-989935`,
    }),
  }),
});

export async function demo() {
  const res = await db
    .insertInto("alpha.whatsapp_webhook_data")
    .values({
      data: JSON.stringify({
        test: "123",
      }),
    })
    .returning("uuid")
    .executeTakeFirstOrThrow();
  return res.uuid;
}
