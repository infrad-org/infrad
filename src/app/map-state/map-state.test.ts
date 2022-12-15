import { expect, test, assert } from "vitest";
import {
  MapState,
  MapEffect as MapEffectWithR,
  MapEvent,
  MapStateManager,
} from "./map-state";
import { DistributiveOmit } from "../../lib/ts-helpers";
import { initState } from "./init";

type MapEffect = DistributiveOmit<MapEffectWithR, "result">;

test("initial state", () => {
  expect(initState()).to.deep.equal({
    tag: "initial",
  });
});

const latLngClicked: MapEvent = {
  tag: "latLngClicked",
  lat: 0,
  lng: 0,
};

test("handleEvent latLngClicked", () => {
  const sm = new MapStateManager();
  const [newState, effects] = sm.try(latLngClicked);
  const expectedState: MapState = {
    tag: "creatingPoint",
    lat: latLngClicked.lat,
    lng: latLngClicked.lng,
  };
  expect(newState).to.deep.equal(expectedState);
  const effect1: MapEffect = {
    tag: "openPopup",
    lat: latLngClicked.lat,
    lng: latLngClicked.lng,
  };
  expect(effects[0]).to.deep.equal(effect1);
});

test("creatingPoint + latLngClicked", () => {
  const sm = new MapStateManager({
    initialState: {
      lat: 1,
      lng: 1,
      tag: "creatingPoint",
    },
  });
  const [newState, effects] = sm.try(latLngClicked);
  assert(newState.tag === "creatingPoint");
  const effect1: MapEffect = {
    tag: "closePopup",
  };
  const effect2: MapEffect = {
    tag: "openPopup",
    lat: latLngClicked.lat,
    lng: latLngClicked.lng,
  };
  expect(effects).to.deep.include(effect1);
  expect(effects).to.deep.include(effect2);
});

test("creatingPoint + pointCreationConfirmed -> waitingForPointCreated", () => {
  const sm = new MapStateManager();

  sm.send(latLngClicked);
  const { lat, lng } = { lat: 1, lng: 1 };
  sm.send({
    tag: "latLngClicked",
    lat,
    lng,
  });
  const [newState, effects] = sm.try({
    tag: "pointCreationConfirmed",
  });
  assert(newState.tag === "waitingForPointCreated");
  const effect1: MapEffect = { tag: "closePopup" };
  const effect2: MapEffect = {
    tag: "createPoint",
    lat: lat,
    lng: lng,
  };
  expect(effects).to.have.length(2);
  expect(effects).to.deep.include(effect1);
  expect(effects).to.deep.include(effect2);
});

test("creatingPoint + close -> initial", () => {
  const sm = new MapStateManager({
    initialState: {
      tag: "creatingPoint",
      lat: 0,
      lng: 0,
    },
  });

  const [newState, effects] = sm.try({
    tag: "close",
  });
  const expectedState: MapState = {
    tag: "initial",
  };
  expect(newState).to.deep.equal(expectedState);
  const effect1: MapEffect = { tag: "closePopup" };
  expect(effects).to.have.length(1);
  expect(effects).to.deep.include(effect1);
});

test("waitingForPointCreated + pointCreated = pointOpen", () => {
  const sm = new MapStateManager();

  const { lat, lng } = latLngClicked;
  sm.send(latLngClicked);
  sm.send({
    tag: "pointCreationConfirmed",
  });

  const id = "some-id";
  const [newState, effects] = sm.try({
    tag: "pointCreated",
    id,
    lat: latLngClicked.lat,
    lng: latLngClicked.lng,
  });
  assert(newState.tag === "pointOpen");
  const effect1: MapEffect = {
    tag: "urlChange",
    path: `/point/${id}`,
  };
  const effect2: MapEffect = {
    tag: "addMarker",
    lat,
    lng,
    id,
  };
  expect(effects).to.have.length(2);
  expect(effects).to.deep.include(effect1);
  expect(effects).to.deep.include(effect2);
});

test("pointOpen(loading=true) + close = initial", () => {
  const sm = new MapStateManager({
    initialState: {
      tag: "pointOpen",
      status: "loading",
    },
  });
  const [newState, effects] = sm.try({
    tag: "close",
  });
  const expectedState: MapState = {
    tag: "initial",
  };
  expect(newState).to.deep.equal(expectedState);
  const effect1: MapEffect = {
    tag: "urlChange",
    path: "/create",
  };
  expect(effects).to.have.length(1);
  expect(effects).to.deep.contain(effect1);
});

test("pointOpen(loading=true) + pointLoaded(found) = pointOpen(loading=false)", () => {
  const sm = new MapStateManager({
    initialState: {
      tag: "pointOpen",
      status: "loading",
    },
  });
  const [newState, effects] = sm.try({
    tag: "pointLoaded",
    point: {
      data: {},
    },
  });
  const expectedState: MapState = {
    tag: "pointOpen",
    status: "found",
    data: {},
  };
  expect(newState).to.deep.equal(expectedState);
  expect(effects).to.have.length(0);
});

test("pointOpen(loading=true) + pointLoaded(not found) = pointOpen(loading=false)", () => {
  const sm = new MapStateManager({
    initialState: {
      tag: "pointOpen",
      status: "loading",
    },
  });
  const [newState, effects] = sm.try({
    tag: "pointLoaded",
    point: null,
  });
  const expectedState: MapState = {
    tag: "pointOpen",
    status: "notFound",
  };
  expect(newState).to.deep.equal(expectedState);
  expect(effects).to.have.length(0);
});

test("initial + openPoint = pointOpen(loading=true)", () => {
  const sm = new MapStateManager();
  const id = "some-id";
  const [newState, effects] = sm.try({
    tag: "openPoint",
    id,
  });
  const expectedState: MapState = {
    tag: "pointOpen",
    status: "loading",
  };
  expect(newState).to.deep.equal(expectedState);
  const effect1: MapEffect = {
    tag: "urlChange",
    path: `/point/${id}`,
  };
  const effect2: MapEffect = {
    tag: "loadPoint",
    id: id,
  };
  expect(effects).to.have.length(2);
  expect(effects).to.deep.include(effect1);
  expect(effects).to.deep.include(effect2);
});

test("creatingPoint + openPoint", () => {
  const sm = new MapStateManager({
    initialState: {
      tag: "creatingPoint",
      lat: 0,
      lng: 0,
    },
  });
  const id = "some-id";
  const [newState, effects] = sm.try({
    tag: "openPoint",
    id,
  });
  const expectedState: MapState = {
    tag: "pointOpen",
    status: "loading",
  };
  expect(newState).to.deep.equal(expectedState);
  const effect1: MapEffect = {
    tag: "urlChange",
    path: `/point/${id}`,
  };
  const effect2: MapEffect = {
    tag: "closePopup",
  };
  const effect3: MapEffect = {
    tag: "loadPoint",
    id,
  };
  expect(effects).to.have.length(3);
  expect(effects).to.deep.include(effect1);
  expect(effects).to.deep.include(effect2);
  expect(effect3).to.deep.include(effect3);
});
