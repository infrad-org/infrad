import React from 'react';
import { MapLayoutHeader } from '../layouts/MapLayout';

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute h-full z-2">
      <div className="flex flex-col h-full z-2">
        <div className="invisible">
          <MapLayoutHeader />
        </div>
        <div className="grow bg-white z-2 opacity-80 m-10">
          {children}
        </div>
      </div>
    </div>
  )
}