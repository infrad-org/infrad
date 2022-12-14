import Toucan from "toucan-js";

export function initSentry(request, env) {
  const sentry = new Toucan({
    dsn: env.SENTRY_DSN,
    request: request,
    allowedHeaders: [
      "user-agent",
      "cf-challenge",
      "accept-encoding",
      "accept-language",
      "cf-ray",
      "content-length",
      "content-type",
      "x-real-ip",
      "host",
    ],
    allowedSearchParams: /(.*)/,
    rewriteFrames: {
      root: "/",
    },
  });
  const colo = request.cf && request.cf.colo ? request.cf.colo : "UNKNOWN";
  sentry.setTag("colo", colo);

  // cf-connecting-ip should always be present, but if not we can fallback to XFF.
  const ipAddress =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for");
  const userAgent = request.headers.get("user-agent") || "";
  sentry.setUser({ ip: ipAddress, userAgent: userAgent, colo: colo });
  return sentry;
}
