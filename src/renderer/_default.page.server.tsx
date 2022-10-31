import React from "react";
import { renderToStream } from "react-streaming/server";
import { escapeInject } from "vite-plugin-ssr";
import type { PageContext } from "./PageContext";
import { PageLayout } from "../layouts/PageLayout";

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "loc", "urlOriginal"];

export async function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;

  const page = (
    <PageLayout pageContext={pageContext}>
      <Page {...pageProps} />
    </PageLayout>
  );

  // Streaming is optional and we can use renderToString() instead
  const stream = await renderToStream(page, {
    userAgent: pageContext.userAgent,
  });

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>Infrad</title>
        <link rel="icon" type="image/png" href="/favicon.png">
        <link href='https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css' rel='stylesheet' />
      </head>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>`;
}
