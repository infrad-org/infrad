import { MapState } from ".";

export function initState(path?: string): MapState {
  if (path) {
    const splitPath = path.slice(1).split("/");
    if (splitPath.length == 2 && splitPath[0] === "point") {
      return {
        tag: "pointOpen",
      };
    }
  }
  return {
    tag: "initial",
  };
}
