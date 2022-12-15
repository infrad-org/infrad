import React from "react";
import { hydrateRoot } from "react-dom/client";
import { PageLayout } from "../layouts/PageLayout";
import { PageContext } from "./PageContext";

export const clientRouting = true;

var root;

export async function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;
  const container = document.getElementById("page-view");
  if (!container) throw new Error("container is null");

  if (pageContext.isHydration) {
    root = hydrateRoot(
      container,
      <PageLayout pageContext={pageContext}>
        <Page {...pageProps} />
      </PageLayout>
    );
  }
  else {
    await root.render(<PageLayout pageContext={pageContext}>
      <Page {...pageProps} />
    </PageLayout>)
  }

}
