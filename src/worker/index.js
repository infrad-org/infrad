import { handleSsr } from "./ssr";
import { handleStaticAssets } from "./static-assets";
import { handleTelefunc } from "./telefunc";
import { getWebCryptSession, login, logout } from "./auth";
import { Client, Pool } from "@neondatabase/serverless";

import { demo } from "../db";

function handleVerify() {
  const { searchParams } = new URL(event.request.url);
  let challenge = searchParams.get("hub.challenge");
  let token = searchParams.get("hub.verify_token");
  console.log("searchParams", searchParams);

  if (token !== WHATSAPP_VERIFY_TOKEN || !challenge) {
    return new Response(null, { status: 403 });
  }

  return new Response(challenge, { status: 200 });
}

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleFetchEvent(event));
  } catch (err) {
    console.error(err.stack);
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});

async function handleFetchEvent(event) {
  const { url } = event.request;
  const { pathname } = new URL(url);

  const webCryptSession = await getWebCryptSession(event.request);
  console.log("webCryptSession", webCryptSession);

  if (!isAssetUrl(url)) {
    const userAgent =
      event.request.headers.get("User-Agent") || "no-user-agent";
    const request = event.request;
    const response = await handleSsr(url, {
      userAgent: userAgent,
      cf: request.cf,
      session: webCryptSession.username
        ? {
            username: webCryptSession.username,
          }
        : null,
    });
    if (response !== null) return response;
  }

  if (pathname.startsWith("/_telefunc")) {
    const body = await event.request.text();
    const { method } = event.request;
    const response = await handleTelefunc({ url, method, body });
    return response;
  }

  if (pathname.startsWith("/login")) {
    return login(webCryptSession, event.request);
  }

  if (pathname.startsWith("/logout")) {
    return logout(event.request);
  }

  const client = new Client(DATABASE_URL);

  if (pathname.startsWith("/webhook/whatsapp")) {
    if (event.request.method === "GET") {
      return handleVerify();
    }

    await client.connect();
    const data = await event.request.json();
    console.log("/webhook/whatsapp data", data);
    await client.query(
      "insert into alpha.whatsapp_webhook_data (data) values ($1)",
      [data]
    );
    await client.end();
  }

  if (pathname.startsWith("/test")) {
    await client.connect();
    const {
      rows: [{ now }],
    } = await client.query("select now()");
    await client.end();
    return new Response(now);
  }

  if (pathname.startsWith("/2test")) {
    return new Response(await demo());
  }

  const response = await handleStaticAssets(event);
  return response;
}

function isAssetUrl(url) {
  const { pathname } = new URL(url);
  return pathname.startsWith("/assets/");
}
