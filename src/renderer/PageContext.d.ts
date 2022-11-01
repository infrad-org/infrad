import React from "react";
import { PointContext } from "../pages/point/@id/index.page.server";
import { Session } from "../worker/auth";

export type PageContext = {
  urlOriginal: string;
  exports: Record<string, any>;
  Page: typeof React.Component;
  fetch?: typeof fetch;
  userAgent: string;
  pageProps: any;
  loc?: { lat: number; long: number };
  point?: PointContext;
  session: Session | null;
};
