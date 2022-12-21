import { BBox } from "geojson";
import { Client } from "pg";
import { z } from "zod";
import { pointSchema } from "./geojson.zod";

export const getPoints = (client: Client) => async (bbox: BBox) => {
  const { rows } = await client.query(
    `SELECT json_agg(points) as points FROM points
    WHERE st_makeenvelope($1, $2, $3, $4) ~ location`,
    bbox
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
};
