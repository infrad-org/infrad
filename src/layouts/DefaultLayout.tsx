import React from "react";

function Header() {
  return (
    <div className="flex items-center">
      <img src="/logo.svg" className="max-h-10em" />
      <h1 className="text-5xl text-dark-orange">Infrad</h1>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mx-auto">
      <a href="/impressum" className="color-gray hover:underline">
        Impressum
      </a>
    </footer>
  );
}

export function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <Header />
      <div>
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  );
}
