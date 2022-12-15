import * as db from "../db/db";

export async function createPoint(long: number, lat: number) {
  return db.createPoint(long, lat);
}
