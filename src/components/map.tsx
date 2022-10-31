import maplibregl from "maplibre-gl";
import React, { useEffect, useReducer, useRef } from "react";
import { usePageContext } from "../renderer/usePageContext";
import { initState, MapStateManager } from "./map-state";

import "./map.css";
import { realEffectHandlers } from "./map-state/map-state-effect-handlers";
import { MapLayoutHeader } from "../layouts/MapLayout";
import { MaterialSymbolsClose } from "./icons";

function Modal({ mapState }: { mapState: MapStateManager }) {
  return (
    <div className="absolute h-full z-2">
      <div className="flex flex-col h-full z-2">
        <div className="invisible">
          <MapLayoutHeader />
        </div>
        <div className="grow bg-white z-2 opacity-80 m-10">
          <div className="flex flex-row-reverse">
            <div
              className="p-2 cursor-pointer"
              onClick={() => {
                mapState.send({
                  tag: "close",
                });
              }}
            >
              <MaterialSymbolsClose className="w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Map() {
  const map = useRef<maplibregl.Map | null>(null);
  const mapDiv = useRef<HTMLDivElement | null>(null);
  const mapState = useRef<MapStateManager>(new MapStateManager());
  const [_, forceRerender] = useReducer((count) => count + 1, 0);

  const { loc } = usePageContext();

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

    mapState.current = new MapStateManager({
      initialState: initState(),
      effectHandlers: realEffectHandlers({
        map: map.current,
      }),
      stateChangeCb: () => {
        forceRerender();
      },
    });

    const handleCreatePointButton = async (innerEvent: MouseEvent) => {
      const target = innerEvent.target;
      if (!(target instanceof Element)) return;
      if (!target.matches("#createpointbutton")) return;
      mapState.current.send({
        tag: "pointCreationConfirmed",
      });
    };

    document.addEventListener("click", handleCreatePointButton); // TODO remove

    map.current.on("click", (e) => {
      mapState.current.send({
        tag: "latLngClicked",
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      });
    });
  }, [mapDiv.current]);

  return (
    <>
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
      {mapState.current.state.tag === "pointOpen" && <Modal mapState={mapState.current} />}
    </>
  );
}
