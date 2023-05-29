export type LoadingState<T> =
  | LoadingState.Loaded<T>
  | LoadingState.Loading
  | LoadingState.Reloading<T>
  | LoadingState.Failed;

export namespace LoadingState {
  export type LoadingError = NonNullable<{}>;
  export type Loading = {
    status: "loading";
  };

  export type Loaded<T> = {
    status: "loaded";
    value: T;
  };

  export type Failed = {
    status: "failed";
    error: LoadingError;
  };

  export type Reloading<T> = {
    status: "reloading";
    prev: T;
  };

  export function getLoaded<T>(state: LoadingState<T>): T | undefined {
    if (state.status === "loaded") {
      return state.value;
    }
    return undefined;
  }

  export function getLoading<T>(state: LoadingState<T>): Loading | undefined {
    return state.status === "loading" ? state : undefined;
  }

  export function getFailed<T>(
    state: LoadingState<T>
  ): LoadingError | undefined {
    if (state.status === "failed") {
      return state.error;
    }
    return undefined;
  }

  export function getReloading<T>(
    state: LoadingState<T>
  ): Reloading<T> | undefined {
    if (state.status == "reloading") {
      return state;
    }
  }

  export function loading(): Loading {
    return { status: "loading" };
  }

  export function loaded<T>(value: T): Loaded<T> {
    return { status: "loaded", value };
  }

  export function failed(error: LoadingError): Failed {
    return { status: "failed", error };
  }

  export function reloading<T>(prev: T): Reloading<T> {
    return { status: "reloading", prev };
  }

  export interface Visitor<T, R> {
    loaded: (loaded: Loaded<T>) => R;
    loading: (loading: Loading) => R;
    failed: (failed: Failed) => R;
    reloading: (reloading: Reloading<T>) => R;
  }

  export function visit<T, R>(
    state: LoadingState<T>,
    visitor: Visitor<T, R>
  ): R {
    switch (state.status) {
      case "loading":
        return visitor.loading(state);
      case "loaded":
        return visitor.loaded(state);
      case "failed":
        return visitor.failed(state);
      case "reloading":
        return visitor.reloading(state);
    }
  }
}
