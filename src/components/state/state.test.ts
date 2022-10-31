import { expect, test, assert } from "vitest";
import {
  initState,
  MapState,
  Effect,
  StateManager,
  MapEvent,
  MapStateManager,
} from ".";

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
  const effect1: Effect = {
    tag: "openPopup",
    lat: latLngClicked.lat,
    lng: latLngClicked.lng,
  };
  expect(effects[0]).to.deep.equal(effect1);
});

test("creatingPoint + latLngClicked", () => {
  const sm = new MapStateManager();
  sm.send(latLngClicked);
  const [newState, effects] = sm.try(latLngClicked);
  assert(newState.tag === "creatingPoint");
  const effect1: Effect = {
    tag: "closePopup",
  };
  const effect2: Effect = {
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
  const [newState, effects] = sm.try({
    tag: "pointCreationConfirmed",
  });
  assert(newState.tag === "waitingForPointCreated");
  const effect1: Effect = { tag: "closePopup" };
  const effect2: Effect = {
    tag: "createPoint",
    lat: latLngClicked.lat,
    lng: latLngClicked.lng,
  };
  expect(effects).to.have.length(2);
  expect(effects).to.deep.include(effect1);
  expect(effects).to.deep.include(effect2);
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
  const effect1: Effect = {
    tag: "urlChange",
    path: `/point/${id}`,
  };
  const effect2: Effect = {
    tag: "addMarker",
    lat,
    lng,
    id,
  };
  expect(effects).to.have.length(2);
  expect(effects).to.deep.include(effect1);
  expect(effects).to.deep.include(effect2);
});

test("pointOpen + close = initial", () => {
  const sm = new MapStateManager({
    initialState: {
      tag: "pointOpen",
    },
  });
  const [newState, effects] = sm.try({
    tag: "close",
  });
  const expectedState: MapState = {
    tag: "initial",
  };
  expect(newState).to.deep.equal(expectedState);
  const effect1: Effect = {
    tag: "urlChange",
    path: "/create",
  };
  expect(effects).to.have.length(1);
  expect(effects).to.deep.contain(effect1);
});

test("initial + openPoint = pointOpen", () => {
  const sm = new MapStateManager();
  const id = "some-id";
  const [newState, effects] = sm.try({
    tag: "openPoint",
    id,
  });
  const expectedState: MapState = {
    tag: "pointOpen",
  };
  expect(newState).to.deep.equal(expectedState);
  const effect1: Effect = {
    tag: "urlChange",
    path: `/point/${id}`,
  };
  expect(effects).to.have.length(1);
  expect(effects).to.deep.include(effect1);
});
