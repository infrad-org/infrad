import { createWebCryptSession } from "webcrypt-session";
import { z } from "zod";

const sessionScheme = z.object({
  username: z.string(),
});

export type Session = z.infer<typeof sessionScheme>;

export async function getWebCryptSession(request: Request) {
  return await createWebCryptSession(sessionScheme, request, {
    password: "IF4B#t69!WlX$uS22blaxDvzJJ%$vEh%", // FIXME
  });
}

function getBaseUrl(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function login(
  webCryptSession: Awaited<ReturnType<typeof getWebCryptSession>>,
  request: Request
) {
  if (request.method !== "POST") {
    throw new Error();
  }

  await webCryptSession.save({
    username: "bart",
  });
  const session = webCryptSession.toHeaderValue();

  if (!session) {
    throw new Error();
  }

  return new Response(null, {
    headers: {
      location: getBaseUrl(request),
      "Set-Cookie": session,
    },
  });
}

export function logout(request: Request) {
  return new Response(null, {
    status: 303,
    headers: {
      location: getBaseUrl(request),
      "Set-Cookie": "session=delete; expires=Thu, 01 Jan 1970 00:00:00 GMT",
    },
  });
}
