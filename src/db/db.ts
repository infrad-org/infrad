import env from "../env.json";
import { z } from "zod";

export async function resetDb() {
  await fetch("http://localhost:3000/rpc/reset_db", {
    method: "POST",
  });
}

function baseUrl() {
  if (globalThis.ENVIRONMENT) return `https://${env.SUPABASE_HOST}/rest/v1`;
  return "http://localhost:3000";
}

function createHeaders() {
  return new Headers({
    "content-type": "application/json",
    ...(globalThis.SUPABASE_API_KEY
      ? { apiKey: globalThis.SUPABASE_API_KEY }
      : {}),
  });
}

async function rpc(method: string, body: Record<any, any>) {
  return fetch(`${baseUrl()}/rpc/${method}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: createHeaders(),
  });
}

export async function createUser(username: string, password: string) {
  const response = await rpc("create_user", {
    username,
    password,
  });
  return response.text();
}

export async function createPoint(long: number, lat: number) {
  const response = await rpc("create_point", {
    lat,
    long,
  });
  const result = await response.json();
  if (typeof result !== "string") {
    throw new Error(
      `Unexpeced response from create_point: ${JSON.stringify(result, null, 2)}`
    );
  }
  return result;
}

export async function runQuery(
  query: string,
  params: Record<string, string> | null = null
) {
  const response = await rpc("custom_query", {
    query,
    ...(params ? { params: JSON.stringify(params) } : {}),
  });
  if (response.status !== 200) {
    throw new Error(
      `${JSON.stringify(
        {
          message: "Failed to execute custom_query",
          response: {
            status: response.status,
            statusText: response.statusText,
            response: await response.json(),
          },
        },
        null,
        2
      )}`
    );
  }
  return response.json();
}

export async function findPoint(id: string) {
  const result = await runQuery(
    "SELECT hashid as id, (loc::json->>'coordinates')::json loc from points WHERE hashid = $1::json->>'id'",
    {
      id,
    }
  );
  return z
    .array(
      z.object({
        id: z.string(),
        loc: z.tuple([z.number(), z.number()]),
      })
    )
    .max(1)
    .transform((val) => (val.length ? val[0] : null))
    .parse(result);
}

export async function getAllPoints() {
  const result = await runQuery(
    "SELECT hashid as id, (loc::json->>'coordinates')::json loc from points"
  );
  return z
    .array(
      z.object({
        id: z.string(),
        loc: z.tuple([z.number(), z.number()]),
      })
    )
    .parse(result);
}
