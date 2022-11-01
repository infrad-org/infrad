import { getAllPoints, findPoint } from "../db/db";

export async function onLoadPoint(id: string) {
  return await findPoint(id);
}

export async function onGetAllPoints() {
  return getAllPoints();
}
