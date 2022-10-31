import { StateManager, EffectHandlers } from "../../lib/state-manager";

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
  | {
      tag: "pointOpen";
    };

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
            },
            [
              {
                tag: "urlChange",
                path: `/point/${event.id}`,
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
            },
            [
              {
                tag: "urlChange",
                path: `/point/${event.id}`,
              },
              {
                tag: "closePopup",
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
