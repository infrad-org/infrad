// @unocss-include

import maplibregl from "maplibre-gl";
import { MapEffect, MapState, MapEvent, MapStateManager } from ".";
import { EffectHandlers } from "../../lib/state-manager";
import { createPoint } from "../../pages/point.telefunc";

const closeIcon =
  '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6Z"/></svg>';

export function getMapLibreEffectHandlers({
  map,
  mapStateManager,
}: {
  map: maplibregl.Map;
  mapStateManager: MapStateManager;
}): EffectHandlers<MapState, MapEvent, MapEffect> {
  return {
    openPopup({ lat, lng }) {
      const html = `
      <p>
      <div class="flex justify-end mr--2 mt--4 pb-2 closepopup">
        <div class="hover:cursor-pointer">${closeIcon}</div>
      </div>
      Have something to say about this place?
      </p>
      <button class='createpointbutton'>Create place</button>`;
      const popup = new maplibregl.Popup({
        className: "infradPopup",
        closeButton: false,
        closeOnClick: false,
      })
        .setLngLat({ lat, lng })
        .setHTML(html)
        .addTo(map);
      popup
        .getElement()
        .querySelector(".closepopup")
        ?.addEventListener("click", () => {
          mapStateManager.send({
            tag: "close",
          });
        });
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
