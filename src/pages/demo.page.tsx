import React, { useEffect } from "react";
import { MapLayout } from "../layouts/MapLayout";

export { MapLayout as Layout };

function Message({ children }: { children: React.ReactNode }) {
  // const {} = ;
  return <div className="z-3 bg-pink">{children}</div>;
}

export function Page() {
  return <></>;
}
