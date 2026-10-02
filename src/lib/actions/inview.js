/** Calls `onchange(visible)` as the node enters / leaves the viewport. */
export function inview(node, { onchange, once = false, rootMargin = '0px' } = {}) {
	const io = new IntersectionObserver(
		([entry]) => {
			onchange?.(entry.isIntersecting);
			if (once && entry.isIntersecting) io.disconnect();
		},
		{ rootMargin }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}
