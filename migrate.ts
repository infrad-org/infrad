import { Umzug } from "umzug";
import pg from "pg";
import type { Client } from "pg";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const connectionString = process.env.DATABASE_URL;

let client: Client;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const getRawSqlClient = () => {
  // this implementation happens to use sequelize, but you may want to use a specialised sql client
  if (!connectionString) throw new Error("Missing DATABASE_URL");

  return {
    query: async (sql: string, values?: unknown[]) => {
      return client.query(sql, values);
    },
  };
};

export const migrator = new Umzug({
  migrations: {
    glob: ["migrations/*.sql", { cwd: __dirname }],
    resolve(params) {
      const downPath = path.join(
        path.dirname(params.path!),
        "down",
        path.basename(params.path!)
      );
      return {
        name: params.name,
        path: params.path,
        up: async () =>
          params.context.query(fs.readFileSync(params.path!).toString()),
        down: async () =>
          params.context.query(fs.readFileSync(downPath).toString()),
      };
    },
  },
  context: getRawSqlClient(),
  storage: {
    async executed({ context: client }) {
      await client.query(
        `create table if not exists my_migrations_table(name text)`
      );

      const { rows: results } = await client.query(
        `select name from my_migrations_table`
      );
      return results.map((r: { name: string }) => r.name);
    },
    async logMigration({ name, context: client }) {
      await client.query(`insert into my_migrations_table(name) values ($1)`, [
        name,
      ]);
    },
    async unlogMigration({ name, context: client }) {
      await client.query(`delete from my_migrations_table where name = $1`, [
        name,
      ]);
    },
  },
  logger: console,
  create: {
    folder: "migrations",
  },
});

(async () => {
  client = new pg.Client({
    connectionString,
  });
  await client.connect();
  await migrator.runAsCLI();
  await client.end();
})();

export type Migration = typeof migrator._types.migration;
