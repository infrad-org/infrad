import React, { useEffect } from 'react';
import { MapLayout } from "../../../layouts/MapLayout";
import { onBeforeRender } from './index.page.server';

export { MapLayout as Layout };

export function Page(props: Awaited<ReturnType<typeof onBeforeRender>>['pageContext']['pageProps']) {
  useEffect(() => {
    alert(props?.loc);
  }, []);
  return <></>;
}
