import React from "react";

export function Page() {
  return (
    <div className="max-w-2xl">
      <h1>Impressum</h1>
      <address>
        Bart Louwers
        <br />
        Uhlandstr. 26
        <br />
        59555 Lippstadt
        <br />
        Germany
      </address>
      <div className="mt-10">
        <a className="h-12 font-bold cursor-pointer" href="/">
          Back to Homepage
        </a>
      </div>
    </div>
  );
}
