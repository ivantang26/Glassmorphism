import { MediaQuery } from 'svelte/reactivity';

/** Reactive user preferences. Server render assumes motion is fine; the client corrects it on hydrate. */
export const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)', false);
export const finePointer = new MediaQuery('(hover: hover) and (pointer: fine)', false);
