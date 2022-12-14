import { DB } from "kysely-codegen";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "@neondatabase/serverless";

function createDb(databaseUrl: string) {
  return new Kysely<DB>({
    // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: `${databaseUrl}?sslmode=require&options=project%3Dep-winter-tree-989935`,
      }),
    }),
  });
}

export async function demo(databaseUrl: string) {
  const db = createDb(databaseUrl);
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
