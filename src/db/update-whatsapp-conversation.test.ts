import { Point } from "geojson";
import { test, expect, assert } from "vitest";
import { getClient } from "./test";
import { updateWhatsAppConversation as uwc } from "./update-whatsapp-conversation";

const testClient = await getClient();

test("updateWhatsAppConversation()", async () => {
  const description1 = "my description";

  const updateWhatsAppConversation = uwc(testClient);

  const result1 = await updateWhatsAppConversation({
    phoneNumberId: "test",
    content: {
      type: "description",
      value: description1,
    },
  });
  if (result1.status !== "pending") throw new Error();
  expect(result1.value.pending_description).to.equal(description1);

  const description2 = "my description 2";
  const result2 = await updateWhatsAppConversation({
    phoneNumberId: "test",
    content: {
      type: "description",
      value: description2,
    },
  });
  if (result2.status !== "pending") throw new Error();
  expect(result2.value.pending_description).to.equal(description2);
  const point: Point = {
    coordinates: [30.0, 30.0],
    type: "Point",
  };
  const result3 = await updateWhatsAppConversation({
    phoneNumberId: "test",
    content: {
      type: "location",
      value: point,
    },
  });
  if (result3.status !== "point_created") throw new Error();
  assert(result3.value.description === description2);
  expect(result3.value.location).to.deep.equal(point);
});
