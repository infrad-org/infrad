import { messageSchema, webHookSchema } from "./webhook.zod";
import { expect, test } from "vitest";

const webhookMessage = () => ({
  object: "whatsapp_business_account",
  entry: [
    {
      id: "114217351529929",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "15550219136",
              phone_number_id: "107921152168021",
            },
            contacts: [
              {
                profile: {
                  name: "Bart",
                },
                wa_id: "123",
              },
            ],
            messages: [
              {
                from: "123",
                id: "wamid.HBgNNDkxNzY1OTk0MTI0NxUCABIYIDBDNTk3RUJFRTRBQjk0RTI0MjJFNDM1OEMxMjIyNTc2AA==",
                timestamp: "1670896802",
                text: {
                  body: "Xoxo",
                },
                type: "text",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
});

test("webHookSchema", () => {
  const result = webHookSchema.parse(webhookMessage());
  expect(result.entry[0].changes[0].value.messages).to.have.length(1);
});

const locationMessage = () => ({
  from: "123",
  id: "wamid.HBgNNDkxNzY1OTk0MTI0NxUCABIYIEI1OTYyNDEzNzQyNjNCM0I5REU4ODJFMEQxMkJCNURBAA==",
  timestamp: "1670970428",
  location: {
    latitude: 54.6833333,
    longitude: 8.333333,
  },
  type: "location",
});

test("messageSchema", () => {
  messageSchema.parse(locationMessage());
});
