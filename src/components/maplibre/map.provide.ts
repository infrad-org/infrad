import { Map } from "maplibre-gl";
import { provide, inject, InjectionKey, Ref } from "vue";

type ProvidedValue = {
  map: Map | null;
  loaded: Ref<boolean>;
};

const mapInjectionKey: InjectionKey<ProvidedValue> = Symbol("maplibre");

export function provideMap({ loaded }: { loaded: Ref<boolean> }) {
  const ret: ProvidedValue = {
    map: null,
    loaded,
  };
  provide(mapInjectionKey, ret);
  return {
    setMap: (map: Map) => {
      ret.map = map;
    },
  };
}

export function useMap() {
  const ret = injectMapLibre();
  if (!ret.map) throw new Error("map still null");
  return ret.map;
}

export function injectMapLibre() {
  const ret = inject(mapInjectionKey);
  if (!ret) throw new Error("Call provideMap() in a parent");
  return ret;
}
