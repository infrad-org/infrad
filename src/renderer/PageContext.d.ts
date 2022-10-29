import type fetch from "node-fetch";
import React from "react";

export type PageContext = {
  urlOriginal: string;
  exports: Record<string, any>;
  Page: typeof React.Component;
  fetch?: typeof fetch;
  userAgent: string;
  pageProps: any;
  loc?: { lat: number; long: number };
};
