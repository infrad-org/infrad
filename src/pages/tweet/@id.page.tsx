import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { MaterialSymbolsClose } from "../../components/icons";
import { MapLayout } from "../../layouts/MapLayout";
import { usePageContext } from "../../renderer/usePageContext";

import "./main.css";

export { MapLayout as Layout };

export function Page() {
  const pageContext = usePageContext();
  console.log("id", pageContext.routeParams.id);

  return (
    <div className="absolute z-10 w-screen h-screen flex items-center">
      <div className="flex flex-row w-full justify-center">
        {/* <div className="h-50vh"> */}
        <div className="flex flex-row justify-end p-3">
          <MaterialSymbolsClose className="w-10 cursor-pointer" />
        </div>
        <TwitterTweetEmbed tweetId={"1590652097099608064"} />
        {/* </div> */}
      </div>
    </div>
  );
}
