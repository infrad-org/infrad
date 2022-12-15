import { getContext } from "telefunc";
import { ClientWrapper } from "../../db/db";

export async function onLoadPoint(id: string) {
  // return await findPoint(id);
  const context = getContext();
  return context;
}

export async function onGetAllPoints() {
  const client = getContext().dbClient;
  console.log("client", client);
  await client.connect();
  const cw = new ClientWrapper(client);
  const result = await cw.getPoints();
  await client.end();
  return result;
  // return getAllPoints();
}
