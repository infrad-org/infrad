import maplibregl from "maplibre-gl";
import React, { useEffect, useRef } from "react";
import { usePageContext } from "../../renderer/usePageContext";
import { MapStateManager } from "../../app/map-state/map-state";
import { getMapLibreEffectHandlers } from "../../app/map-state/map-libre-effect-handlers";
import { onGetAllPoints } from "../../app/map-state/map.telefunc";

type Tweet = {
  lat: number;
  lng: number;
  url: string;
};

function MapLibre() {
  const mapDiv = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { loc } = usePageContext();

  useEffect(() => {
    if (!mapDiv.current) return;
    if (map.current) return;

    map.current = new maplibregl.Map({
      attributionControl: true,
      container: "map",
      style:
        "https://api.maptiler.com/maps/basic-v2/style.json?key=FTNrjsa7Nahw874tmMi7", // stylesheet location
      center: [6.09443220658732, 52.51228602846009], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });

    map.current.dragRotate.disable();

    (async () => {
      const points = await onGetAllPoints();
      for (const {location, description} of points) {
        const popup = new maplibregl.Popup().setLngLat(location.coordinates).setText(description);
        new maplibregl.Marker({
          color: "#ff7f2a"
        }).setLngLat(location.coordinates).setPopup(popup).addTo(map.current);
      }
    })();

  //   const handleCreatePointButton = async (innerEvent: MouseEvent) => {
  //     const target = innerEvent.target;
  //     if (!(target instanceof Element)) return;
  //     if (!target.matches(".createpointbutton")) return;
  //     mapStateManager.send({
  //       tag: "pointCreationConfirmed",
  //     });
  //   };
  //   document.addEventListener("click", handleCreatePointButton);

  //   map.current.on("click", (e) => {
  //     mapStateManager.send({
  //       tag: "latLngClicked",
  //       lat: e.lngLat.lat,
  //       lng: e.lngLat.lng,
  //     });
  //   });

  //   map.current.on("click", (e) => {
  //     console.log(e.lngLat);
  //   });

  //   mapStateManager.updateEffectHandlers(
  //     getMapLibreEffectHandlers({ map: map.current, mapStateManager })
  //   );
  }, []);

  return <>
    <div
      id="map"
      style={{
        left: "0",
        top: "0",
        position: "absolute",
        width: "100vw",
        height: "100vh"
        // height: mapStateManager.state.tag === 'pointOpen' ? "50vh" : "100vh",
      }}
      ref={mapDiv}
    ></div>
  </>
}

const MapLibreMemoized = React.memo(MapLibre);
export { MapLibreMemoized as MapLibre };
