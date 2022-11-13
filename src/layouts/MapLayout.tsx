import React, { useReducer } from "react";
import Spinner from "../components/spinner/Spinner";
import { Map } from '../components/map/map';
import { MapStateManagerProvider } from "../app/map-state/map-state-context";
import { usePageContext } from "../renderer/usePageContext";
import { navigate } from "vite-plugin-ssr/client/router";

function LoginButton() {
  function handleClick() {
    (async () => {
      await fetch('/login', {
        method: 'POST'
      });
      // location.reload();
      navigate('/login')
    })();
  }

  return (
    <button onClick={handleClick}>
      Login
    </button>
  )
}

function LogoutButton() {
  function handleClick() {
    (async () => {
      await fetch('/logout', {
        method: 'POST'
      });
      location.reload();
    })();
  }

  return (
    <button onClick={handleClick}>
      Logout
    </button>)
}

function LoginControls() {
  const { session } = usePageContext();

  return (
    <div>
      {session ? <LogoutButton /> : <LoginButton />}
    </div>
  )
}

function Infrad() {
  return (
    <div className="flex flex-row z-10" onClick={() => {
      console.log('bam')
      navigate('/create')
    }}>
      <img src="/logo.svg" className="max-h-3em pr-3" onClick={() => {
        console.log('bam')
        navigate('/create')
      }} />
      <h1 className="text-5xl text-dark-orange">Infrad</h1>
    </div>)
}

export function MapLayoutHeader() {
  return (
    <div className="z-2 w-screen bg-white bg-opacity-75 py-3 px-5">
      <div className="flex justify-between items-center">
        <Infrad />
        <div>
          <LoginControls />
        </div>
      </div>
    </div>
  );
}

export function MapLayout({ children }: { children: React.ReactNode }) {
  const [_, forceRerender] = useReducer((count) => count + 1, 0);

  return (
    <>
      <MapStateManagerProvider forceRerender={forceRerender}>
        <div className="absolute w-full flex flex-col">
          <MapLayoutHeader />
          {/* <div className="grow flex justify-center items-center">
            <Spinner />
          </div> */}
          {children}
          <div className="grow bg-white z-2 opacity-80 m-10">
          </div>
        </div>
        <Map />
      </MapStateManagerProvider>
    </>
  );
}
