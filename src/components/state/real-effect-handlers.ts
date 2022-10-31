import maplibregl from "maplibre-gl";
import { EffectHandlers, MapEffect, MapState, MapEvent } from ".";
import { createPoint } from "../../pages/point.telefunc";

export function realEffectHandlers({
  map,
}: {
  map: maplibregl.Map;
}): EffectHandlers<MapState, MapEvent, MapEffect> {
  return {
    openPopup({ lat, lng }) {
      const html = `<p>Have something to say about this place?</p>
      <button id='createpointbutton'>Create place</button>`;
      const popup = new maplibregl.Popup({
        className: "infradPopup",
        closeButton: false,
        closeOnClick: false,
      })
        .setLngLat({ lat, lng })
        .setHTML(html)
        .addTo(map);
      return {
        close() {
          popup.remove();
        },
      };
    },
    closePopup(event, { effectResultHistory }) {
      const openPopupHistory = effectResultHistory["openPopup"];
      if (!openPopupHistory.length) {
        console.error(
          "Failed to execute closePopup effect, no openPopup event found in history"
        );
        return;
      }
      openPopupHistory[openPopupHistory.length - 1].close();
    },
    async createPoint({ lng, lat }, { send }) {
      const id = await createPoint(lng, lat);
      send({
        tag: "pointCreated",
        id,
        lat,
        lng,
      });
    },
    urlChange({ path }) {
      history.pushState({}, "", path);
    },
    addMarker({ lat, lng, id }, { send }) {
      const marker = new maplibregl.Marker({
        color: "#ff7f2a",
      })
        .setLngLat({ lat, lng })
        .addTo(map);
      marker.getElement().addEventListener("click", (e) => {
        e.stopPropagation();
        send({
          tag: "openPoint",
          id,
        });
      });
    },
  };
}
