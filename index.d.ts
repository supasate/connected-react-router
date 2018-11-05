declare module 'connected-react-router' {
  import * as React from 'react';
  import { Middleware, Reducer } from 'redux';
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
  
  export interface LocationChangeAction {
    type: typeof LOCATION_CHANGE;
    payload: RouterState;
  }

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

  export type RouterAction = LocationChangeAction | CallHistoryMethodAction;

  export function push(path: Path, state?: LocationState): RouterAction;
  export function push(location: LocationDescriptorObject): RouterAction;
  export function replace(path: Path, state?: LocationState): RouterAction;
  export function replace(location: LocationDescriptorObject): RouterAction;
  export function go(n: number): RouterAction;
  export function goBack(): RouterAction;
  export function goForward(): RouterAction;

  export const routerActions: {
    push: typeof push;
    replace: typeof replace;
    go: typeof go;
    goBack: typeof goBack;
    goForward: typeof goForward;
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
