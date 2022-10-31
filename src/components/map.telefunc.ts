import { getAllPoints } from "../db/db";

export async function onGetAllPoints() {
  return getAllPoints();
}
