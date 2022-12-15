import React, {createContext, useCallback, useState} from 'react';
import maplibregl from 'maplibre-gl';

type MapLibreContext = {
  map: maplibregl.Map
};

const MapLibreContext = createContext<MapLibreContext | null>(null);

export function MapLibreProvider({ long, lat, children}: {
  long?: number,
  lat?: number
  children: React.ReactNode
}) {

  const [context, setContext] = useState<MapLibreContext | null>(null);

  const mapRef = useCallback((div: HTMLDivElement | null) => {
    if (!div) return;
    const map = new maplibregl.Map({
      attributionControl: true,
      container: "map",
      style:
        "https://api.maptiler.com/maps/basic-v2/style.json?key=FTNrjsa7Nahw874tmMi7", // stylesheet location
      center: [long || -74.5, lat || 40], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });
    setContext({
      map
    });

  }, []);

  const contents = context ? 
    <MapLibreContext.Provider value={context}>
      {children}
    </MapLibreContext.Provider> : <>{children}</>;

  return <div ref={mapRef}>
    {contents}
  </div>;
}