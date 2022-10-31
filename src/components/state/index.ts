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

export type EffectsWithResult<Effect> = Extract<Effect, { result: any }>;
export type EffectsWithoutResult<Effect> = Exclude<
  Effect,
  EffectsWithResult<Effect>
>;

export function initState(): MapState {
  return {
    tag: "initial",
  };
}

type EffectResultHistory<
  Effect extends { tag: EffectTag },
  EffectTag extends string = Effect["tag"]
> = {
  [eff in EffectsWithResult<Effect>["tag"]]: EffectsWithResult<Effect>["result"][];
};

type EventHandlers<
  State extends { tag: StateTags },
  Event extends { tag: EventTags },
  Effect extends { tag: EffectTags },
  StateTags extends string = State["tag"],
  EventTags extends string = Event["tag"],
  EffectTags extends string = Effect["tag"]
> = {
  [stateTag in State["tag"]]?: {
    [eventTag in Event["tag"]]?: (
      s: State & { tag: stateTag },
      e: Event & { tag: eventTag }
    ) => [State, Effect[]];
  };
};

type EffectHandlerArgs<
  State extends { tag: StateTags },
  Event extends { tag: EventTags },
  Effect extends { tag: EffectTags },
  effectTag extends Effect["tag"],
  StateTags extends string = State["tag"],
  EventTags extends string = Event["tag"],
  EffectTags extends string = Effect["tag"]
> = [
  effect: Effect & { tag: effectTag },
  config: {
    effectResultHistory: EffectResultHistory<Effect>;
    send: StateManager<State, Event, Effect>["send"];
  }
];

export type EffectHandlers<
  State extends { tag: StateTags },
  Event extends { tag: EventTags },
  Effect extends { tag: EffectTags },
  StateTags extends string = State["tag"],
  EventTags extends string = Event["tag"],
  EffectTags extends string = Effect["tag"]
> = {
  [effectTag in EffectsWithoutResult<Effect>["tag"]]?: (
    ...args: EffectHandlerArgs<State, Event, Effect, effectTag>
  ) => void;
} & {
  [effectTag in EffectsWithResult<Effect>["tag"]]?: (
    ...args: EffectHandlerArgs<State, Event, Effect, effectTag>
  ) => EffectsWithResult<Effect>["result"];
};

const openPoint: NonNullable<
  EventHandlers<
    MapState,
    MapEvent,
    DistributiveOmit<MapEffect, "result">
  >["initial"]
>["openPoint"] &
  NonNullable<
    EventHandlers<
      MapState,
      MapEvent,
      DistributiveOmit<MapEffect, "result">
    >["creatingPoint"]
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

export abstract class StateManager<
  State extends { tag: StateTags },
  Event extends { tag: EventTags },
  Effect extends { tag: EffectTags },
  StateTags extends string = State["tag"],
  EventTags extends string = Event["tag"],
  EffectTags extends string = Effect["tag"]
> {
  state: State;
  eventHandlers: EventHandlers<
    State,
    Event,
    DistributiveOmit<Effect, "result">
  > = {};
  effectHandlers: EffectHandlers<State, Event, Effect> = {};
  effectResultHistory: EffectResultHistory<Effect> =
    this.initEffectResultHistory();
  stateChangeCb: () => void = () => {};

  abstract initEffectResultHistory(): EffectResultHistory<Effect>;

  constructor({
    effectHandlers,
    stateChangeCb,
    initialState,
  }: {
    effectHandlers?: EffectHandlers<State, Event, Effect>;
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
  try(event: Event): [State, DistributiveOmit<Effect, "result">[]] {
    return (
      this.eventHandlers[this.state.tag]?.[event.tag]?.(
        this.state as any,
        event as any
      ) || [this.state, []]
    );
  }

  doEffect(effect: DistributiveOmit<Effect, "result">) {
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
  constructor({
    effectHandlers,
    initialState,
    stateChangeCb,
  }: Partial<
    ConstructorParameters<typeof StateManager<MapState, MapEvent, MapEffect>>[0]
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
