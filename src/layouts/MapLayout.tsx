import React from "react";
import Spinner from "../components/spinner/Spinner";
import { Map } from '../components/map';
import { MapStateManagerProvider } from "../components/map-state/context";

export function MapLayoutHeader() {
  return (
    <div className="z-2 w-screen bg-white bg-opacity-75 py-3 px-5">
      <div className="flex flex-row">
        <img src="/logo.svg" className="max-h-3em pr-3" />
        <h1 className="text-5xl text-dark-orange">Infrad</h1>
      </div>
    </div>
  );
}

export function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute h-full w-full flex flex-col">
        <MapLayoutHeader />
        <div className="grow flex justify-center items-center">
          <Spinner />
        </div>
      </div>
      <MapStateManagerProvider>
        <Map />
        {children}
      </MapStateManagerProvider>
    </>
  );
}
