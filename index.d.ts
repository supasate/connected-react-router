declare module 'connected-react-router' {
  import * as React from 'react';
  import { Middleware, Reducer } from 'redux';
  import { match } from 'react-router';
  import {
    History,
    Path,
    Location,
    LocationState,
    LocationDescriptorObject
  } from 'history';

  interface ConnectedRouterProps {
    history: History;
  }

  export type RouterActionType = 'POP' | 'PUSH' | 'REPLACE';

  export interface RouterState {
    location: Location
    action: RouterActionType
  }

  export const LOCATION_CHANGE: '@@router/LOCATION_CHANGE';
  export const CALL_HISTORY_METHOD: '@@router/CALL_HISTORY_METHOD';

  export interface LocationChangeAction {
    type: typeof LOCATION_CHANGE;
    payload: RouterState;
  }

  export interface CallHistoryMethodAction {
    type: typeof CALL_HISTORY_METHOD;
    payload: LocationActionPayload;
  }

  export interface RouterRootState {
    router: RouterState;
  }

  export type matchSelectorFn<
    S extends RouterRootState, Params extends { [K in keyof Params]?: string }
  > = (state: S) => match<Params> | null;

  export type RouterAction = LocationChangeAction | CallHistoryMethodAction;

  export function push(path: Path, state?: LocationState): CallHistoryMethodAction;
  export function push(location: LocationDescriptorObject): CallHistoryMethodAction;
  export function replace(path: Path, state?: LocationState): CallHistoryMethodAction;
  export function replace(location: LocationDescriptorObject): CallHistoryMethodAction;
  export function go(n: number): CallHistoryMethodAction;
  export function goBack(): CallHistoryMethodAction;
  export function goForward(): CallHistoryMethodAction;
  export function getRouter<S extends RouterRootState>(state: S): RouterState;
  export function getAction<S extends RouterRootState>(state: S): RouterActionType;
  export function getHash<S extends RouterRootState>(state: S): string;
  export function getLocation<S extends RouterRootState>(state: S): Location;
  export function getSearch<S extends RouterRootState>(state: S): string;
  export function createMatchSelector<
    S extends RouterRootState, Params extends { [K in keyof Params]?: string }
  >(path: string): matchSelectorFn<S, Params>;

  export type Push = typeof push;
  export type Replace = typeof replace;
  export type Go = typeof go;
  export type GoBack = typeof goBack;
  export type GoForward = typeof goForward;

  export const routerActions: {
    push: Push;
    replace: Replace;
    go: Go;
    goBack: GoBack;
    goForward: GoForward;
  };

  export interface LocationActionPayload {
    method: string;
    args?: any[];
  }

  export class ConnectedRouter extends React.Component<
    ConnectedRouterProps,
    {}
  > {}

  export function connectRouter(history: History)
    : Reducer<RouterState, LocationChangeAction>

  export function routerMiddleware(history: History): Middleware;
}
