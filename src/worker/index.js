import { handleSsr } from "./ssr";
import { handleStaticAssets } from "./static-assets";
import { handleTelefunc } from "./telefunc";
import { getWebCryptSession, login, logout } from "./auth";

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

  const response = await handleStaticAssets(event);
  return response;
}

function isAssetUrl(url) {
  const { pathname } = new URL(url);
  return pathname.startsWith("/assets/");
}
