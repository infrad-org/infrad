import React from 'react';
import { Modal } from '../components/modal';

import { MapLayout } from "../layouts/MapLayout";

export const Layout = MapLayout;

export const Page = () => {
  return (
    <div className="bg-white z-2 opacity-80 m-10 min-h-lg">
      <div className='z-60'>
        <input type="text" />
        <input type="password" />
        <button>Login</button>
      </div>
    </div>)
}