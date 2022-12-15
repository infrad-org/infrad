import { Client } from "@neondatabase/serverless";
import { provideTelefuncContext, telefunc } from "telefunc";

export async function handleTelefunc({ url, method, body }, env) {
  provideTelefuncContext({
    dbClient: new Client({
      connectionString: env.DATABASE_URL,
    }),
  });
  const httpResponse = await telefunc({ url, method, body });
  return new Response(httpResponse.body, {
    headers: { "content-type": httpResponse.contentType },
    status: httpResponse.statusCode,
  });
}
