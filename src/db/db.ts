import env from "../env.json";

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
    console.log("result", result);
    throw new Error(
      `Unexpeced response from create_point: ${JSON.stringify(result, null, 2)}`
    );
  }

  return result;
}
