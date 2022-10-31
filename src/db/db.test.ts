import { afterEach, assert, expect, test } from "vitest";
import { resetDb, createPoint, findPoint, getAllPoints } from "./db";

afterEach(async () => {
  resetDb();
});

test("creating a point", async () => {
  const result = await createPoint(0, 0);
  assert(
    typeof result === "string",
    `expected result to be string, instead got ${result}`
  );
  assert(
    result.length === 10,
    `expected result to have length 10, instead got length ${result.length}, result=${result}`
  );
});

test("fetch a point", async () => {
  const lng = 1.0;
  const lat = 2.0;
  const id = await createPoint(lng, lat);
  const point = await findPoint(id);
  if (!point) throw new Error("findPoint failed to find point");
  assert(point.id === id);
  assert(point.loc[0] === lng);
  assert(point.loc[1] === lat);
});

test("getAllPoints()", async () => {
  await createPoint(0, 0);
  const allPoints = await getAllPoints();
  expect(allPoints).to.have.length.greaterThanOrEqual(1);
});
