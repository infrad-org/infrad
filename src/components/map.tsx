import React, { useEffect } from "react";
import { MapStateManager } from "./map-state";

import "./map.css";
import { MaterialSymbolsClose } from "./icons";
import { onGetAllPoints } from "./map.telefunc";
import { MapLibre } from "./maplibre";
import { MapLayoutHeader } from "../layouts/MapLayout";
import { useMapStateManager } from "./map-state/context";

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

function useAllPoints(mapStateManager: MapStateManager) {
  useEffect(() => {
    (async () => {
      const points = await onGetAllPoints();
      points.forEach(({ id, loc }) => mapStateManager.doEffect({
        tag: 'addMarker',
        id,
        lng: loc[0],
        lat: loc[1]
      }));
    })();
  }, []);
}


export function Map() {
  const mapStateManager = useMapStateManager();
  useAllPoints(mapStateManager);

  return (
    <>
      <MapLibre mapStateManager={mapStateManager} />
      {mapStateManager.state.tag === "pointOpen" && <Modal mapState={mapStateManager} />}
    </>
  );
}
