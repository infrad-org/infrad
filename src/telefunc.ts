import type { Client } from "pg";
import { getContext as getTelefuncContext } from "telefunc";

type TelefuncContext = {
  dbClient: Client;
};

export function getContext() {
  return getTelefuncContext<TelefuncContext>();
}
