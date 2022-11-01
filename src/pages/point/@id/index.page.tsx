import React, { useEffect } from 'react';
import { useMapStateManager } from '../../../components/map-state/context';
import { MapLayout } from "../../../layouts/MapLayout";
import { usePageContext } from '../../../renderer/usePageContext';
import { onBeforeRender } from './index.page.server';

export { MapLayout as Layout };

export function Page() {
  const mapStateManager = useMapStateManager();
  const { point } = usePageContext();
  useEffect(() => {
    if (point) {
      mapStateManager.doEffect({
        tag: 'goToCoords',
        lng: point.loc[0],
        lat: point.loc[1]
      })
    }
  }, []);
  return <></>;
}
