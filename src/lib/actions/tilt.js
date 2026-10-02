/**
 * Tilts a glass card up to `max` degrees towards the cursor and moves the
 * edge highlight with it. Fine pointers only; off for reduced motion.
 */
export function tilt(node, { max = 4 } = {}) {
	const ok = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
	if (!ok.matches) return;

	node.dataset.tilt = '';
	node.style.transition = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
	let frame = 0;

	function move(event) {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			const r = node.getBoundingClientRect();
			const x = (event.clientX - r.left) / r.width;
			const y = (event.clientY - r.top) / r.height;
			node.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 2 * max).toFixed(2)}deg) rotateY(${((x - 0.5) * 2 * max).toFixed(2)}deg)`;
			node.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
			node.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
		});
	}
	function enter() {
		node.classList.add('is-tilting');
	}
	function leave() {
		cancelAnimationFrame(frame);
		node.classList.remove('is-tilting');
		node.style.transform = '';
	}

	node.addEventListener('pointerenter', enter);
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			cancelAnimationFrame(frame);
			node.removeEventListener('pointerenter', enter);
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
}
