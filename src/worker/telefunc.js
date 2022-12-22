import { Client } from "@neondatabase/serverless";
import { provideTelefuncContext, telefunc } from "telefunc";

export async function handleTelefunc({ url, method, body }, env) {
  const dbClient = new Client({
    connectionString: env.DATABASE_URL,
  });
  await dbClient.connect();
  provideTelefuncContext({
    dbClient,
  });
  const httpResponse = await telefunc({ url, method, body });
  await dbClient.end();
  return new Response(httpResponse.body, {
    headers: { "content-type": httpResponse.contentType },
    status: httpResponse.statusCode,
  });
}
