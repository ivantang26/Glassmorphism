/**
 * Minimal analytics hook. Pushes to a dataLayer if one is installed and
 * emits a DOM event either way, so any provider can be wired in later.
 */
export function track(event, props = {}) {
	if (typeof window === 'undefined') return;
	const detail = { event, ...props, path: location.pathname };
	window.dataLayer?.push(detail);
	window.dispatchEvent(new CustomEvent('lumen:track', { detail }));
}
