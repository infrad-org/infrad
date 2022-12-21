import { Client } from "pg";
import { afterAll } from "vitest";

/**
 * This function sets up and tears down a `pg-node` Client for tests.
 *
 * @returns A connected Client
 */
export async function getClient() {
  const testClient = new Client({
    connectionString: "postgres://louwers:password@localhost/infraddb",
  });

  await testClient.connect();
  afterAll(async () => {
    await testClient.end();
  });
  return testClient;
}
