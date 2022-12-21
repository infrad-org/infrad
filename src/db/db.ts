import type { Client } from "pg";
import { z } from "zod";
import type { Point, BBox } from "geojson";
import { pointSchema } from "./geojson.zod";

export class ClientWrapper {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
