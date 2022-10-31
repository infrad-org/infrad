import { DistributiveOmit } from "../../ts-helpers";

export type State =
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

export type Event =
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

export type EffectR =
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

export const effectConfig: {
  [effectTag in EffectR["tag"]]?: {
    afterStateTransition: boolean;
  };
} = {
  createPoint: {
    afterStateTransition: true,
  },
};

export type EffectsWithResult = Extract<EffectR, { result: any }>;
export type EffectsWithoutResult = Exclude<EffectR, EffectsWithResult>;

export type Effect = DistributiveOmit<EffectR, "result">;

export function initState(): State {
  return {
    tag: "initial",
  };
}

type EffectResultHistory = {
  [eff in EffectsWithResult["tag"]]: EffectsWithResult["result"][];
};

type EventHandlers = {
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

const openPoint: NonNullable<EventHandlers["initial"]>["openPoint"] &
  NonNullable<EventHandlers["creatingPoint"]>["openPoint"] = (
  _state,
  event
) => {
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

export class StateManager<State extends { tag: string }> {
  state: State;
  eventHandlers: EventHandlers = {
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
  try(event: Event) {
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
    effects
      .filter((effect) => !effectConfig[effect.tag]?.afterStateTransition)
      .forEach((effect) => this.doEffect(effect));
    this.state = newState;
    console.log("New state: ", newState);
    this.stateChangeCb();
    effects
      .filter((effect) => effectConfig[effect.tag]?.afterStateTransition)
      .forEach((effect) => this.doEffect(effect));
  }
}

export class MapStateManager extends StateManager<State> {
  constructor({
    effectHandlers,
    initialState,
    stateChangeCb,
  }: Partial<ConstructorParameters<typeof StateManager<State>>[0]> = {}) {
    super({
      initialState: initialState ? initialState : initState(),
      effectHandlers,
      stateChangeCb,
    });
  }
}
