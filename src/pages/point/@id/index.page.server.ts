import { findPoint } from "../../../db/db";
import { PageContext } from "../../../renderer/PageContext";

export async function onBeforeRender({
  routeParams,
}: PageContext & {
  routeParams: { id: string };
}) {
  const point = await findPoint(routeParams.id);
  return {
    pageContext: {
      point,
    },
  };
}

export type PointContext = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["point"];
