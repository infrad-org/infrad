import type { Client } from "pg";
import { z } from "zod";
import type { Point, BBox } from "geojson";
import { pointSchema } from "./geojson.zod";

export class ClientWrapper {
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  async updateWhatsAppConversation({
    phoneNumberId,
    content,
  }: {
    phoneNumberId: string;
    content:
      | {
          type: "description";
          value: string;
        }
      | {
          type: "location";
          value: Point;
        };
  }) {
    const { rows } = await this.client.query(
      "SELECT update_whatsapp_conv($1::jsonb)",
      [
        JSON.stringify({
          phone_number_id: phoneNumberId,
          ...(content.type === "description"
            ? { description: content.value }
            : { location: content.value }),
        }),
      ]
    );
    const pendingSchema = z.object({
      status: z.literal("pending"),
      value: z.object({
        pending_description: z.string(),
      }),
    });

    const pointCreatedSchema = z.object({
      status: z.literal("point_created"),
      value: z.object({
        description: z.string(),
        location: pointSchema,
      }),
    });

    const schema = z
      .array(
        z.object({
          update_whatsapp_conv: z.union([pendingSchema, pointCreatedSchema]),
        })
      )
      .length(1);
    return schema.parse(rows)[0].update_whatsapp_conv;
  }

  async getPoints() {
    // bbox: BBox
    //  WHERE st_makeenvelope($1, $2, $3, $4) ~ location;
    const { rows } = await this.client.query(
      "SELECT json_agg(points) as points FROM points"
      // bbox
    );
    return z
      .array(
        z.object({
          hashid: z.string(),
          location: pointSchema,
          description: z.string(),
        })
      )
      .parse(rows[0].points);
  }
}
