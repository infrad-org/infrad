import { pipeToWebWritable, pipeToNodeWritable } from "@vue/server-renderer";

import { escapeInject, stampPipe } from "vite-plugin-ssr";
import { createApp } from "./app";
import type { Writable } from "stream";

export { render };
export { passToClient };

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ["pageProps"];

async function render(pageContext: any) {
  const app = createApp(pageContext);

  // Streaming is optional: we can use renderToString() instead.
  const pipe = isWorker()
    ? (writable: WritableStream) => {
        pipeToWebWritable(app, {}, writable);
      }
    : // While developing, we use Vite's development sever instead of a Cloudflare worker. Instead of `pipeToNodeWritable()`, we could as well use `renderToString()`.
      (writable: Writable) => {
        pipeToNodeWritable(app, {}, writable);
      };
  stampPipe(pipe, isWorker() ? "web-stream" : "node-stream");

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>Infrad</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
      </head>
      <body>
        <div id="app">${pipe}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
    },
  };
}

// https://github.com/cloudflare/wrangler2/issues/1481
// https://community.cloudflare.com/t/how-to-detect-the-cloudflare-worker-runtime/293715
function isWorker() {
  return (
    // @ts-ignore
    typeof WebSocketPair !== "undefined" || typeof caches !== "undefined"
  );
}
