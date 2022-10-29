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
