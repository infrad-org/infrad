import { DistributiveOmit } from "../../ts-helpers";

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
    };

export type EffectsWithResult = Extract<MapEffect, { result: any }>;
export type EffectsWithoutResult = Exclude<MapEffect, EffectsWithResult>;

export type Effect = DistributiveOmit<MapEffect, "result">;

export function initState(): MapState {
  return {
    tag: "initial",
  };
}

type EffectResultHistory = {
  [eff in EffectsWithResult["tag"]]: EffectsWithResult["result"][];
};

type EventHandlers<
  State extends { tag: StateTags },
  Event extends { tag: EventTags },
  StateTags extends string = State["tag"],
  EventTags extends string = Event["tag"]
> = {
  [stateTag in State["tag"]]?: {
    [eventTag in Event["tag"]]?: (
      s: State & { tag: stateTag },
      e: Event & { tag: eventTag }
    ) => [State, Effect[]];
  };
};

type EffectHandlerArgs<effectTag extends string> = [
  effect: Effect & { tag: effectTag },
  config: {
    effectResultHistory: EffectResultHistory;
    send: MapStateManager["send"];
  }
];

export type EffectHandlers = {
  [effectTag in EffectsWithoutResult["tag"]]?: (
    ...args: EffectHandlerArgs<effectTag>
  ) => void;
} & {
  [effectTag in EffectsWithResult["tag"]]?: (
    ...args: EffectHandlerArgs<effectTag>
  ) => EffectsWithResult["result"];
};

const openPoint: NonNullable<
  EventHandlers<MapState, MapEvent>["initial"]
>["openPoint"] &
  NonNullable<
    EventHandlers<MapState, MapEvent>["creatingPoint"]
  >["openPoint"] = (_state, event) => {
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
};

export class StateManager<
  State extends { tag: StateTags },
  Event extends { tag: EventTags },
  StateTags extends string = State["tag"],
  EventTags extends string = Event["tag"]
> {
  state: State;
  eventHandlers: EventHandlers<State, Event> = {};
  effectHandlers: EffectHandlers = {};
  effectResultHistory: EffectResultHistory = {
    openPopup: [],
  };
  stateChangeCb: () => void = () => {};

  constructor({
    effectHandlers,
    stateChangeCb,
    initialState,
  }: {
    effectHandlers?: EffectHandlers;
    stateChangeCb?: () => void;
    initialState: State;
  }) {
    if (effectHandlers) this.effectHandlers = effectHandlers;
    if (stateChangeCb) this.stateChangeCb = stateChangeCb;
    this.state = initialState;
  }

  /**
   * Returns new state and effects that would occur upon sending an event.
   */
  try(event: Event): [State, Effect[]] {
    return (
      this.eventHandlers[this.state.tag]?.[event.tag]?.(
        this.state as any,
        event as any
      ) || [this.state, []]
    );
  }

  doEffect(effect: Effect) {
    console.log("Handling effect: ", effect);
    const effectResult = this.effectHandlers[effect.tag]?.(effect as any, {
      effectResultHistory: this.effectResultHistory,
      send: this.send.bind(this),
    });
    if (effect.tag in this.effectResultHistory) {
      this.effectResultHistory[
        effect.tag as keyof typeof this.effectResultHistory
      ].push(effectResult as any);
    }
  }

  send(event: Event) {
    console.log("Received event: ", event);
    const [newState, effects] = this.try(event);
    effects.forEach((effect) => this.doEffect(effect));
    this.state = newState;
    console.log("New state: ", newState);
    this.stateChangeCb();
  }
}

export class MapStateManager extends StateManager<MapState, MapEvent> {
  constructor({
    effectHandlers,
    initialState,
    stateChangeCb,
  }: Partial<
    ConstructorParameters<typeof StateManager<MapState, MapEvent>>[0]
  > = {}) {
    super({
      initialState: initialState ? initialState : initState(),
      effectHandlers,
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
        openPoint,
      },
      creatingPoint: {
        latLngClicked(state, { lat, lng }) {
          return [
            state,
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
        openPoint,
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
}
