import React from "react";
import { PageContextProvider } from "../renderer/usePageContext";
import { PageContext } from "../renderer/PageContext";
import { DefaultLayout } from "./DefaultLayout";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "./main.css";

export function PageLayout({
  pageContext,
  children,
}: {
  pageContext: PageContext;
  children: React.ReactNode;
}) {
  const Layout = pageContext.exports.Layout || DefaultLayout;

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>{children}</Layout>
      </PageContextProvider>
    </React.StrictMode>
  );
}
