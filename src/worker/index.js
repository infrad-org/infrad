import { handleSsr } from "./ssr";
import { handleStaticAssets } from "./static-assets";
import { handleTelefunc } from "./telefunc";

addEventListener("fetch", (event) => {
  try {
    event.respondWith(
      handleFetchEvent(event).catch((err) => {
        console.error(err.stack);
      })
    );
  } catch (err) {
    console.error(err.stack);
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});

async function handleFetchEvent(event) {
  const { url } = event.request;
  const { pathname } = new URL(url);

  if (!isAssetUrl(url)) {
    const userAgent =
      event.request.headers.get("User-Agent") || "no-user-agent";
    const request = event.request;
    const response = await handleSsr(url, userAgent, request.cf);
    if (response !== null) return response;
  }

  if (pathname.startsWith("/_telefunc")) {
    const body = await event.request.text();
    const { method } = event.request;
    const response = await handleTelefunc({ url, method, body });
    return response;
  }

  const response = await handleStaticAssets(event);
  return response;
}

function isAssetUrl(url) {
  const { pathname } = new URL(url);
  return pathname.startsWith("/assets/");
}
