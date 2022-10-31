import maplibregl from "maplibre-gl";
import React, { useEffect, useRef } from "react";
import { usePageContext } from "../renderer/usePageContext";
import { MapStateManager } from "./map-state";
import { getMapLibreEffectHandlers } from "./map-state/map-libre-effect-handlers";

function MapLibre({ mapStateManager }: { mapStateManager: MapStateManager }) {
  const mapDiv = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { loc } = usePageContext();

  console.log('rerender');

  useEffect(() => {
    if (!mapDiv.current) return;
    if (map.current) return;

    map.current = new maplibregl.Map({
      attributionControl: true,
      container: "map",
      style:
        "https://api.maptiler.com/maps/basic-v2/style.json?key=FTNrjsa7Nahw874tmMi7", // stylesheet location
      center: [loc?.long || -74.5, loc?.lat || 40], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });

    const handleCreatePointButton = async (innerEvent: MouseEvent) => {
      const target = innerEvent.target;
      if (!(target instanceof Element)) return;
      if (!target.matches(".createpointbutton")) return;
      mapStateManager.send({
        tag: "pointCreationConfirmed",
      });
    };
    document.addEventListener("click", handleCreatePointButton);

    map.current.on("click", (e) => {
      mapStateManager.send({
        tag: "latLngClicked",
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      });
    });

    mapStateManager.updateEffectHandlers(getMapLibreEffectHandlers({ map: map.current, mapStateManager }));
  }, []);

  return <>
    <div
      id="map"
      style={{
        left: "0",
        top: "0",
        position: "absolute",
        width: "100vw",
        height: "100vh",
      }}
      ref={mapDiv}
    ></div>
  </>
}

const MapLibreMemoized = React.memo(MapLibre);
export { MapLibreMemoized as MapLibre };