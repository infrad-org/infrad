import { handleSsr } from "./ssr";
import { handleStaticAssets } from "./static-assets";
import { handleTelefunc } from "./telefunc";
import { getWebCryptSession, login, logout } from "./auth";
import { initSentry } from "./sentry";
import { handleWhatsAppWebhook } from "./whatsapp/webhook";

function handleError(request, env, err) {
  const sentry = initSentry(request, env);
  sentry.captureException(err);
  console.error(err);
  return new Response("Internal Error", { status: 500 });
}

export default {
  async fetch(request, env, ctx) {
    try {
      const { url } = request;
      const { pathname } = new URL(url);

      const webCryptSession = await getWebCryptSession(request);

      if (!isAssetUrl(url)) {
        const userAgent = request.headers.get("User-Agent") || "no-user-agent";
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
        const body = await request.text();
        const { method } = request;
        const response = await handleTelefunc({ url, method, body }, env);
        return response;
      }

      if (pathname.startsWith("/login")) {
        return login(webCryptSession, request);
      }

      if (pathname.startsWith("/logout")) {
        return logout(request);
      }

      if (pathname.startsWith("/webhook/whatsapp")) {
        return handleWhatsAppWebhook(request, env, ctx);
      }

      if (pathname.startsWith("/throw")) {
        throw new Error("error");
      }

      const response = await handleStaticAssets(request, env, ctx);
      return response;
    } catch (err) {
      return handleError(request, env, err);
    }
  },
};

function isAssetUrl(url) {
  const { pathname } = new URL(url);
  return pathname.startsWith("/assets/");
}
