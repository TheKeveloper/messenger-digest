export type LoadingState<T> =
  | LoadingState.Loaded<T>
  | LoadingState.Loading
  | LoadingState.Failed;

export namespace LoadingState {
  export type LoadingError = Exclude<any, undefined | null>;
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

  export function getLoaded<T>(state: LoadingState<T>): T | undefined {
    if (state.status === "loaded") {
      return state.value;
    }
    return undefined;
  }

  export function isLoading<T>(state: LoadingState<T>) {
    return state.status === "loading";
  }

  export function getFailed<T>(
    state: LoadingState<T>
  ): LoadingError | undefined {
    if (state.status === "failed") {
      return state.error;
    }
    return undefined;
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

  export interface Visitor<T, R> {
    loaded: (value: T) => R;
    loading: () => R;
    failed: (error: LoadingError) => R;
  }

  export function visit<T, R>(
    state: LoadingState<T>,
    visitor: Visitor<T, R>
  ): R {
    switch (state.status) {
      case "loading":
        return visitor.loading();
      case "loaded":
        return visitor.loaded(state.value);
      case "failed":
        return visitor.failed(state.error);
    }
  }
}
