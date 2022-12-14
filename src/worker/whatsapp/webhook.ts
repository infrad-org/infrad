import { z } from "zod";
import { ClientWrapper } from "../../db/db";
import { Client } from "@neondatabase/serverless";

const commonMessageSchema = {
  from: z.string(),
};

const locationMessageSchema = z
  .object({
    type: z.literal("location"),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  })
  .extend(commonMessageSchema);

const textMessageSchema = z
  .object({
    type: z.literal("text"),
    text: z.object({
      body: z.string(),
    }),
  })
  .extend(commonMessageSchema);

export const messageSchema = z.union([
  locationMessageSchema,
  textMessageSchema,
]);

export const webHookSchema = z.object({
  entry: z.array(
    z.object({
      id: z.string(),
      changes: z.array(
        z.object({
          value: z.object({
            metadata: z.object({
              phone_number_id: z.string(),
            }),
            messages: z.array(z.unknown()),
          }),
        })
      ),
    })
  ),
});

export async function handleWhatsAppWebhook(request: Request, env, ctx) {
  const data = await request.json();
  const parsed = webHookSchema.safeParse(data);

  if (!parsed.success) {
    console.warn("Failed to parse data:", data);
    console.warn("ZodError: ", parsed.error);
    return new Response(null, { status: 200 });
  }
  console.log(parsed.data);

  const db = new ClientWrapper(new Client(env.DATABASE_URL));

  const entry = parsed.data.entry;
  for (const e of entry) {
    for (const c of e.changes) {
      if (!c.value.messages) break;
      for (const m of c.value.messages) {
        const parsedMessage = messageSchema.safeParse(m);
        if (!parsedMessage.success) {
          console.warn("Failed to parse message", {
            message: m,
            error: parsedMessage.error,
          });
          break;
        } // ignoring message
        if (parsedMessage.data.type === "location") {
          console.log("updaing conversation");
          await db.updateWhatsAppConversation({
            phoneNumberId: parsedMessage.data.from,
            content: {
              type: "location",
              value: {
                coordinates: [
                  parsedMessage.data.location.longitude,
                  parsedMessage.data.location.latitude,
                ],
                type: "Point",
              },
            },
          });
          break;
        }

        console.log("saving description");
        await db.updateWhatsAppConversation({
          phoneNumberId: parsedMessage.data.from,
          content: {
            type: "description",
            value: parsedMessage.data.text.body,
          },
        });
      }
    }
  }

  return new Response(null, { status: 200 });
}
