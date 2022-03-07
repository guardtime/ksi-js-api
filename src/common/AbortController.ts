import { AbortController } from 'abort-controller';
const abortController = globalThis.AbortController || AbortController;
export { abortController as AbortController };
