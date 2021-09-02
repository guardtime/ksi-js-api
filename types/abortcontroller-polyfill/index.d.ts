declare namespace AbortController {}

declare module 'abortcontroller-polyfill/src/ponyfill.js' {
  export function abortableFetch(fetch: (url: unknown, init?: unknown) => Promise<unknown>): {
    fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
  };

  class AbortController {
    public signal: AbortSignal;
    public abort(): void;
  }
}
