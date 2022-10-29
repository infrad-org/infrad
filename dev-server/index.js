// We use a Express.js server for development

const express = require("express");
const { renderPage } = require("vite-plugin-ssr");
const vite = require("vite");
const fetch = require("node-fetch");
const { telefunc, provideTelefuncContext } = require("telefunc");

startServer();

async function startServer() {
  const app = express();

  const viteDevMiddleware = (
    await vite.createServer({
      server: { middlewareMode: true },
    })
  ).middlewares;
  app.use(viteDevMiddleware);

  app.use(express.text()); // Parse & make HTTP request body available at `req.body`
  app.all("/_telefunc", async (req, res) => {
    const { user } = req;
    provideTelefuncContext({ user });
    const httpResponse = await telefunc({
      url: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    const { body, statusCode, contentType } = httpResponse;
    res.status(statusCode).type(contentType).send(body);
  });

  app.get("*", async (req, res, next) => {
    const userAgent = req.headers["user-agent"];
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      fetch,
      userAgent,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    res.type(httpResponse.contentType).status(httpResponse.statusCode);
    httpResponse.pipe(res);
  });

  const port = 3333;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
