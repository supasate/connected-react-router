declare module 'connected-react-router' {
  import * as React from 'react';
  import { Middleware, Reducer } from 'redux';
  import { ReactReduxContextValue } from 'react-redux';
  import { match, matchPath } from 'react-router';
  import {
    Action,
    Hash,
    History,
    Path,
    Location,
    LocationState,
    LocationDescriptorObject,
    Search
  } from 'history';

  type PathParam = Parameters<typeof matchPath>[1];

  interface ConnectedRouterProps<S = LocationState> {
    history: History<S>;
    context?: React.Context<ReactReduxContextValue>;
    noInitialPop?: boolean;
    noTimeTravelDebugging?: boolean;
    omitRouter?: boolean;
    children?: React.ReactNode;
  }

  export type RouterActionType = Action;

  export interface RouterLocation<S> extends Location<S> {
    query: Record<string, string>
  }

  export interface RouterState<S = LocationState> {
    location: RouterLocation<S>
    action: RouterActionType
  }

  export const LOCATION_CHANGE: '@@router/LOCATION_CHANGE';
  export const CALL_HISTORY_METHOD: '@@router/CALL_HISTORY_METHOD';

  export interface LocationChangeAction<S = LocationState> {
    type: typeof LOCATION_CHANGE;
    payload: LocationChangePayload<S>;
  }

  export interface LocationChangePayload<S = LocationState> extends RouterState<S> {
    isFirstRendering: boolean;
  }

  export interface CallHistoryMethodAction<A = any[]> {
    type: typeof CALL_HISTORY_METHOD;
    payload: LocationActionPayload<A>;
  }

  export interface RouterRootState<S = LocationState> {
    router: RouterState<S>;
  }

  export type matchSelectorFn<
    S extends RouterRootState, Params extends { [K in keyof Params]?: string }
  > = (state: S) => match<Params> | null;

  export type RouterAction<S = LocationState> = LocationChangeAction<S> | CallHistoryMethodAction;

  export function push<S = LocationState>(path: Path, state?: S): CallHistoryMethodAction<[ Path, S? ]>;
  export function push<S = LocationState>(location: LocationDescriptorObject<S>): CallHistoryMethodAction<[ LocationDescriptorObject<S> ]>;
  export function replace<S = LocationState>(path: Path, state?: S): CallHistoryMethodAction<[ Path, S? ]>;
  export function replace<S = LocationState>(location: LocationDescriptorObject<S>): CallHistoryMethodAction<[ LocationDescriptorObject<S> ]>;
  export function go(n: number): CallHistoryMethodAction<[ number ]>;
  export function goBack(): CallHistoryMethodAction<[]>;
  export function goForward(): CallHistoryMethodAction<[]>;
  export function getRouter<S extends RouterRootState<LS>, LS = LocationState>(state: S): RouterState<LS>;
  export function getAction<S extends RouterRootState>(state: S): RouterActionType;
  export function getHash<S extends RouterRootState>(state: S): Hash;
  export function getLocation<S extends RouterRootState<LS>, LS = LocationState>(state: S): RouterLocation<LS>;
  export function getSearch<S extends RouterRootState>(state: S): Search;
  export function createMatchSelector<
    S extends RouterRootState, Params extends { [K in keyof Params]?: string }
  >(path: PathParam): matchSelectorFn<S, Params>;
  export function onLocationChanged<S = LocationState>(location: Location<S>, action: RouterActionType, isFirstRendering?: boolean)
    : LocationChangeAction<S>;

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

  export interface LocationActionPayload<A = any[]> {
    method: string;
    args?: A;
  }

  export class ConnectedRouter<S = LocationState> extends React.Component<
    ConnectedRouterProps<S>,
    {}
  > {}

  export function connectRouter<S = LocationState>(history: History<S>)
    : Reducer<RouterState<S>>

  export function routerMiddleware<S = LocationState>(history: History<S>): Middleware;
}
