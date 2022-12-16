import { z } from "zod";

export const commonMessageSchema = {
  from: z.string(),
};

export const locationMessageSchema = z
  .object({
    type: z.literal("location"),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  })
  .extend(commonMessageSchema);

export const textMessageSchema = z
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
