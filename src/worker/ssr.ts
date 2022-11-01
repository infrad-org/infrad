import { renderPage } from "vite-plugin-ssr";
import { PageContext } from "../renderer/PageContext";

function getLoc(cf?: IncomingRequestCfProperties) {
  return cf &&
    "longitude" in cf &&
    typeof cf.longitude == "string" &&
    typeof cf.longitude == "string"
    ? { long: Number(cf.longitude), lat: Number(cf.latitude) }
    : undefined;
}

export async function handleSsr(
  url: string,
  userAgent: string,
  cf?: IncomingRequestCfProperties
) {
  const pageContextInit: Omit<PageContext, "Page" | "exports" | "pageProps"> = {
    urlOriginal: url,
    fetch,
    userAgent,
    loc: getLoc(cf),
  };
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;
  if (!httpResponse) {
    return null;
  } else {
    const { statusCode, contentType } = httpResponse;
    const stream = httpResponse.getReadableWebStream();
    return new Response(stream, {
      headers: { "content-type": contentType },
      status: statusCode,
    });
  }
}
