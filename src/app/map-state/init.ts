import { MapState } from "./map-state";
import { PageContext } from "../../renderer/PageContext";
import { usePageContext } from "../../renderer/usePageContext";

export function initState({ point }: Partial<PageContext> = {}): MapState {
  if (point) {
    return {
      tag: "pointOpen",
      status: "found",
      data: point.data,
    };
  }
  if (point === null) {
    return {
      tag: "pointOpen",
      status: "notFound",
    };
  }
  return {
    tag: "initial",
  };
}
