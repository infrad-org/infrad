import React, { createContext, ReactNode, useContext, useReducer, useRef } from 'react';
import { MapStateManager } from '.';

const MapStateManagerContext = createContext<MapStateManager | null>(null);

export function useMapStateManager() {
  const mapStateManager = useContext(MapStateManagerContext);
  if (!mapStateManager)
    throw new Error(
      'useContext(MapStateManagerContext) returned null, ' +
      'make sure to use MapStateManagerProvider');
  return mapStateManager;
}

export function MapStateManagerProvider({ children }: { children: ReactNode }) {
  const [count, forceRerender] = useReducer((count) => count + 1, 0);
  const mapStateManager = useRef<MapStateManager>(new MapStateManager({
    stateChangeCb() {
      forceRerender();
    }
  }));

  return <MapStateManagerContext.Provider value={mapStateManager.current}>
    {children}
  </MapStateManagerContext.Provider>
}