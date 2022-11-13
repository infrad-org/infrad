import { StateManager, EffectHandlers } from "../../lib/state-manager";
import { initState } from "./init";

type PointOpen = {
  tag: "pointOpen";
} & (
  | {
      status: "loading";
    }
  | {
      status: "found";
      data: Record<string, any>;
    }
  | {
      status: "notFound";
    }
);

export type MapState =
  | {
      tag: "initial";
    }
  | {
      tag: "creatingPoint";
      lng: number;
      lat: number;
    }
  | {
      tag: "waitingForPointCreated";
    }
  | PointOpen;

export type MapEvent =
  | {
      tag: "latLngClicked";
      lng: number;
      lat: number;
    }
  | {
      tag: "pointCreationConfirmed";
    }
  | {
      tag: "pointCreated";
      id: string;
      lng: number;
      lat: number;
    }
  | {
      tag: "close";
    }
  | {
      tag: "openPoint";
      id: string;
    }
  | PointLoaded;

export type PointLoaded = {
  tag: "pointLoaded";
  point: Omit<PointOpen & { status: "found" }, "status" | "tag"> | null;
};

export type MapEffect =
  | {
      tag: "openPopup";
      lat: number;
      lng: number;
      result: {
        close: () => void;
      };
    }
  | {
      tag: "closePopup";
    }
  | {
      tag: "urlChange";
      path: string;
    }
  | {
      tag: "addMarker";
      id: string;
      lng: number;
      lat: number;
    }
  | {
      tag: "createPoint";
      lng: number;
      lat: number;
    }
  | {
      tag: "goToCoords";
      lng: number;
      lat: number;
    }
  | {
      tag: "loadPoint";
      id: string;
    };

export class MapStateManager extends StateManager<
  MapState,
  MapEvent,
  MapEffect
> {
  initEffectResultHistory() {
    return {
      openPopup: [],
    };
  }

  effectsBeforeEffectHandlers: MapEffect[] = [];

  constructor({
    effectHandlers,
    initialState,
    stateChangeCb,
  }: Partial<
    ConstructorParameters<typeof StateManager<MapState, MapEvent, MapEffect>>[0]
  > = {}) {
    super({
      initialState: initialState ? initialState : initState(),
      effectHandlers: new Proxy(
        {},
        {
          get: (target, p, receiver) => {
            this.effectsBeforeEffectHandlers.push(receiver);
            console.log(this.effectsBeforeEffectHandlers.length);
          },
        }
      ),
      stateChangeCb,
    });

    this.eventHandlers = {
      initial: {
        latLngClicked(state, event) {
          return [
            {
              tag: "creatingPoint",
              lat: event.lat,
              lng: event.lng,
            },
            [
              {
                tag: "openPopup",
                lat: event.lat,
                lng: event.lng,
              },
            ],
          ];
        },
        openPoint(_state, event) {
          return [
            {
              tag: "pointOpen",
              status: "loading",
            },
            [
              {
                tag: "urlChange",
                path: `/point/${event.id}`,
              },
              {
                tag: "loadPoint",
                id: event.id,
              },
            ],
          ];
        },
      },
      creatingPoint: {
        latLngClicked(state, { lat, lng }) {
          return [
            {
              ...state,
              lat,
              lng,
            },
            [
              {
                tag: "closePopup",
              },
              {
                tag: "openPopup",
                lat,
                lng,
              },
            ],
          ];
        },
        pointCreationConfirmed({ lat, lng }) {
          return [
            {
              tag: "waitingForPointCreated",
            },
            [
              {
                tag: "createPoint",
                lat,
                lng,
              },
              {
                tag: "closePopup",
              },
            ],
          ];
        },
        openPoint(_state, event) {
          return [
            {
              tag: "pointOpen",
              status: "loading",
            },
            [
              {
                tag: "urlChange",
                path: `/point/${event.id}`,
              },
              {
                tag: "closePopup",
              },
              {
                tag: "loadPoint",
                id: event.id,
              },
            ],
          ];
        },
        close() {
          return [
            {
              tag: "initial",
            },
            [
              {
                tag: "closePopup",
              },
            ],
          ];
        },
      },
      waitingForPointCreated: {
        pointCreated(_state, { lat, lng, id }) {
          return [
            {
              tag: "pointOpen",
              status: "found",
              data: {},
            },
            [
              {
                tag: "urlChange",
                path: `/point/${id}`,
              },
              {
                tag: "addMarker",
                lat,
                lng,
                id,
              },
            ],
          ];
        },
      },
      pointOpen: {
        close() {
          return [
            {
              tag: "initial",
            },
            [
              {
                tag: "urlChange",
                path: "/create",
              },
            ],
          ];
        },
        pointLoaded(state, event) {
          if (state.status !== "loading") {
            return [state, []];
          }
          if (!event.point) {
            return [
              {
                tag: "pointOpen",
                status: "notFound",
              },
              [],
            ];
          }
          return [
            {
              ...event.point,
              status: "found",
              tag: "pointOpen",
            },
            [],
          ];
        },
      },
    };
  }

  updateEffectHandlers(
    effectHandlers: EffectHandlers<MapState, MapEvent, MapEffect>
  ) {
    this.effectHandlers = effectHandlers;
    this.effectsBeforeEffectHandlers.forEach((effect) => this.doEffect(effect));
  }
}