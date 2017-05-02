declare module 'connected-react-router' {
  import * as React from 'react'
  import { Action, Middleware, Reducer } from 'redux'
  import { History, Path, LocationState, LocationDescriptorObject } from 'history'

  interface ConnectedRouterProps {
    history: History
  }

  export interface RouterState {
    location: {
      pathname: string,
      search: string,
      hash: string,
      key: string,
    },
    action: 'POP' | 'PUSH'
  }

  export const LOCATION_CHANGE: string
  export const CALL_HISTORY_METHOD: string

  export function push(path: Path, state?: LocationState): Action
  export function push(location: LocationDescriptorObject): Action
  export function replace(path: Path, state?: LocationState): Action
  export function replace(location: LocationDescriptorObject): Action
  export function go(n: number): Action
  export function goBack(): Action
  export function goForward(): Action

  export const routerActions: {
    push: typeof push,
    replace: typeof replace,
    go: typeof go,
    goBack: typeof goBack,
    goForward: typeof goForward,
  }

  export class ConnectedRouter extends React.Component<ConnectedRouterProps, {}> {

  }

  export function connectRouter(history: History)
    : <S>(reducer: Reducer<S>) => Reducer<S>

  export function routerMiddleware(history: History): Middleware
}
