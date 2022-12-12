import { afterEach, assert, expect, test } from "vitest";
import {
  resetDb,
  createPoint,
  findPoint,
  getAllPoints,
  addCommentToPoint,
} from "./db";

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

test("addCommentToPoint", async () => {
  const id = await createPoint(0, 0);
  const content = "hello world";
  await addCommentToPoint(id, { type: "text", content });
  const point = await findPoint(id);
  if (!point) throw new Error("point is null");
  expect(point.data.comments).to.have.length(1);
  await addCommentToPoint(id, { type: "text", content });
  const point2 = await findPoint(id);
  if (!point2) throw new Error("point is null");
  expect(point2.data.comments).to.have.length(2);
});
