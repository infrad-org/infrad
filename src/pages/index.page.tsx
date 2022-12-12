import React from "react";
import { Button } from "../components/button";

export function Page() {
  return (
    <>
      <div className="w-full bg-#7a2601 flex justify-center">
        <img src="/header.jpg" className="w-full lg:w-2xl" />
      </div>
      <div className="bg-#f8aa84 flex justify-center py-6 flex-grow">
        <div className="px-20 lg:max-w-2xl text-#471700">
          <h1 className="text-6xl lg:text-4xl lg:text-4xl font-bold py-8">
            Effortless crowdsourced infrastructure intelligence
          </h1>
          <p className="py-5 text-5xl lg:text-3xl lg:text-lg">
            We believe that the people living, working and getting around in
            their towns and cities are an invaluable asset for decision makers
            and planners. Infrad gathers all ideas, initiatives, praise and
            concerns related to public infrastructure from social media and
            makes this data available on a dashboard. You can use this data to
            make decisions and give transparency by sharing pending changes and
            progress.
          </p>
          {/* <div className="flex flex-row justify-center">
            <a href="/demo">
              <button className="bg-#7a2601 hover:bg-#803819  text-#f8aa84 p-10 text-6xl lg:text-4xl my-10">
                Demo
              </button>
            </a>
          </div> */}
        </div>
      </div>
      <div className="bg-#7a2601 text-#f8aa84 flex flex-col items-center py-6">
        <div>
          <p className="text-5xl py-5 lg:text-lg">Get in touch to learn more</p>
        </div>
        <p className="font-bold text-6xl lg:text-4xl lg:text-3xl my-4">
          <a href="m&#97;ilto:team&#64;infrad&#46;app">
            team&#64;infrad&#46;app
          </a>
        </p>
      </div>
    </>
  );
}
