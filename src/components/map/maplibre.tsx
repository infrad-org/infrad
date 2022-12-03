import maplibregl from "maplibre-gl";
import React, { useEffect, useRef } from "react";
import { usePageContext } from "../../renderer/usePageContext";
import { MapStateManager } from "../../app/map-state/map-state";
import { getMapLibreEffectHandlers } from "../../app/map-state/map-libre-effect-handlers";

type Tweet = {
  lat: number;
  lng: number;
  url: string;
};

const tweets: Tweet[] = [
  {
    lat: 52.5104492,
    lng: 6.0896,
    url: "https://twitter.com/fraterhuis/status/1592464689027756033",
  },
  {
    lat: 52.508130413514166,
    lng: 6.091265642987047,
    url: "https://twitter.com/ZwolleFietst/status/1591756486447095813/photo/1",
  },
  {
    lat: 52.49717918220526,
    lng: 6.108516002039496,
    url: "https://twitter.com/PierreSpaninks/status/1587429449573736448",
  },
];

function MapLibre({ mapStateManager }: { mapStateManager: MapStateManager }) {
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
    for (const { lat, lng, url } of tweets) {
      const marker = new maplibregl.Marker({
        color: "#ff7f2a",
      })
        .setLngLat({ lat, lng })
        .addTo(map.current);
      marker.getElement().addEventListener("click", (e) => {
        window.open(url);
      });
    }

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

    map.current.on("click", (e) => {
      console.log(e.lngLat);
    });

    // mapStateManager.updateEffectHandlers(
    //   getMapLibreEffectHandlers({ map: map.current, mapStateManager })
    // );
  }, []);

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
    </>
  );
}

const MapLibreMemoized = React.memo(MapLibre);
export { MapLibreMemoized as MapLibre };
