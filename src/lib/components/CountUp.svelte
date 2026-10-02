<script>
	import { untrack } from 'svelte';
	import { reducedMotion } from '$lib/motion.svelte.js';

	/** Animates to `value` over 600ms; instant with reduced motion. Screen readers get the final value only. */
	let { value, format = String, duration = 600 } = $props();

	let shown = $state(untrack(() => value));

	$effect(() => {
		const to = value;
		const from = untrack(() => shown);
		if (reducedMotion.current || from === to) {
			shown = to;
			return;
		}
		const start = performance.now();
		let frame = requestAnimationFrame(function step(now) {
			const k = Math.min(1, (now - start) / duration);
			shown = from + (to - from) * (1 - (1 - k) ** 3);
			if (k < 1) frame = requestAnimationFrame(step);
		});
		return () => cancelAnimationFrame(frame);
	});
</script>

<span aria-hidden="true">{format(shown)}</span><span class="sr-only">{format(value)}</span>
