import { BBox } from "geojson";
import { getPoints } from "../../db/get-points";
import { getContext } from "../../telefunc";

export async function onPoints(bbox: BBox) {
  const { dbClient } = getContext();
  const points = await getPoints(dbClient)(bbox);
  return points;
}
