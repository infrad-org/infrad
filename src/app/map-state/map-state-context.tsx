import React, { createContext, ReactNode, useContext, useRef } from 'react';
import { MapStateManager } from './map-state';
import { usePageContext } from '../../renderer/usePageContext';
import { initState } from './init';

const MapStateManagerContext = createContext<MapStateManager | null>(null);

export function useMapStateManager() {
  const mapStateManager = useContext(MapStateManagerContext);
  if (!mapStateManager)
    throw new Error(
      'useContext(MapStateManagerContext) returned null, ' +
      'make sure to use MapStateManagerProvider');
  return mapStateManager;
}

export function MapStateManagerProvider({ children, forceRerender }: { children: ReactNode, forceRerender: () => void }) {
  const mapStateManager = useRef<MapStateManager>(new MapStateManager({
    initialState: initState(usePageContext()),
    stateChangeCb() {
      forceRerender();
    }
  }));

  return <MapStateManagerContext.Provider value={mapStateManager.current}>
    {children}
  </MapStateManagerContext.Provider>
}