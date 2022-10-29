import React from "react";
import { hydrateRoot } from "react-dom/client";
import { PageLayout } from "../layouts/PageLayout";
import { PageContext } from "./PageContext";

export async function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;
  const container = document.getElementById("page-view");
  if (!container) throw new Error("container is null");

  hydrateRoot(
    container,
    <PageLayout pageContext={pageContext}>
      <Page {...pageProps} />
    </PageLayout>
  );
}
