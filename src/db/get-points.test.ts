import { assert, test } from "vitest";
import { getPoints } from "./get-points";
import { getClient } from "./test";

const c = await getClient();

test("getPoints()", async () => {
  const result = await getPoints(c)([29, 29, 31, 31]);
  assert(result.length > 1);
});
