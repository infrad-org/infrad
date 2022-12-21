import { ClientWrapper } from "../../db/db";
import { Client } from "@neondatabase/serverless";
import { messageSchema, webHookSchema } from "./webhook.zod";
import {
  updateWhatsAppConversation,
  WhatsAppConversationUpdate,
} from "../../db/update-whatsapp-conversation";
import { z } from "zod";

export function messageToUpdate(
  message: z.infer<typeof messageSchema>
): WhatsAppConversationUpdate {
  switch (message.type) {
    case "location":
      return {
        phoneNumberId: message.from,
        content: {
          type: "location",
          value: {
            coordinates: [
              message.location.longitude,
              message.location.latitude,
            ],
            type: "Point",
          },
        },
      };

    case "text":
      return {
        phoneNumberId: message.from,
        content: {
          type: "description",
          value: message.text.body,
        },
      };
  }
}

export async function handleWebhookMessage(
  data: z.infer<typeof webHookSchema>,
  client: Client
) {
  const entry = data.entry;
  const updates: WhatsAppConversationUpdate[] = [];

  // for (const e of entry) {
  //   for (const change of e.changes) {
  //     if (!change.value.messages) break;
  //     for (const m of change.value.messages) {
  //       const parsedMessage = messageSchema.safeParse(m);
  //       if (!parsedMessage.success) {
  //         console.warn("Failed to parse message", {
  //           message: m,
  //           error: parsedMessage.error,
  //         });
  //         break;
  //       } // ignoring message
  //       const update = messageToUpdate(parsedMessage.data);
  //       updates.push(update);
  //     }
  //   }
  // }
  const saveMessage = client.query(
    `
    INSERT INTO whatsapp_webhook_messages (data) VALUES ($1) 
  `,
    [data]
  );
  await saveMessage;
  // await Promise.all([
  //   ...updates.map(updateWhatsAppConversation(client)),
  //   saveMessage,
  // ]);
}

export async function handleWhatsAppWebhook(request: Request, env, ctx) {
  const data = await request.json();
  const parsed = webHookSchema.safeParse(data);

  if (!parsed.success) {
    console.warn("Failed to parse data:", data);
    console.warn("ZodError: ", parsed.error);
    return new Response(null, { status: 200 });
  }

  const client = new Client(env.DATABASE_URL);
  await client.connect();

  await handleWebhookMessage(parsed.data, client);

  await client.end();

  return new Response(null, { status: 200 });
}
