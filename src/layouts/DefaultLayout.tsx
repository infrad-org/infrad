import React from "react";

function Header() {
  return (
    <div className="flex items-center justify-center py-4 border-y-5 border-y-#7a2601">
      <img src="/logo.svg" className="max-h-8em" />
      <h1 className="text-8xl lg:text-7xl font-bold text-dark-orange">
        Infrad
      </h1>
    </div>
  );
}

function Footer() {
  return (
    <>
      {/* <footer className="w-full bg-#f8aa84 flex justify-center py-3">
        <a href="/impressum" className=" hover:underline">
          Impressum
        </a>
      </footer> */}
    </>
  );
}

export function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <Header />
      <div className="flex flex-col flex-grow">
        <>{children}</>
      </div>
      <Footer />
    </div>
  );
}
