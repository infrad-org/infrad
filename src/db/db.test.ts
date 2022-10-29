import { afterEach, assert, test } from "vitest";
import { resetDb, createPoint } from "./db";

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
