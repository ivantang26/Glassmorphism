<script>
	import { inview } from '$lib/actions/inview.js';

	/**
	 * Background colour field. Shows 2 blobs on mobile, 3 on tablet and up to
	 * `count` on desktop, where they drift. Animation pauses off-screen.
	 */
	let { count = 4, preset = 'hero' } = $props();

	// x / y are positions within the band; size is the blob diameter as a share of viewport width
	const PRESETS = {
		hero: [
			{ c: 'violet', x: 12, y: 10, s: 62 },
			{ c: 'teal', x: 88, y: 20, s: 52 },
			{ c: 'coral', x: 70, y: 62, s: 48 },
			{ c: 'blue', x: 8, y: 82, s: 50 }
		],
		wide: [
			{ c: 'violet', x: 82, y: 30, s: 56 },
			{ c: 'blue', x: 12, y: 70, s: 50 },
			{ c: 'teal', x: 45, y: 95, s: 44 },
			{ c: 'coral', x: 30, y: 8, s: 40 }
		],
		soft: [
			{ c: 'coral', x: 90, y: 18, s: 50 },
			{ c: 'violet', x: 6, y: 50, s: 56 },
			{ c: 'blue', x: 78, y: 88, s: 46 },
			{ c: 'teal', x: 40, y: 72, s: 40 }
		],
		calm: [
			{ c: 'blue', x: 85, y: 12, s: 54 },
			{ c: 'teal', x: 8, y: 70, s: 50 }
		]
	};

	const blobs = $derived(PRESETS[preset].slice(0, count));
	let visible = $state(true);
</script>

<div class="blobs" class:paused={!visible} aria-hidden="true" use:inview={{ onchange: (v) => (visible = v), rootMargin: '200px' }}>
	{#each blobs as b, i (b.c)}
		<span
			class="blob drift-{(i % 3) + 1}"
			style:--c="var(--{b.c})"
			style:left="{b.x}%"
			style:top="{b.y}%"
			style:--s="{b.s}vw"
			style:--dur="{20 + i * 3}s"
			style:--delay="{-i * 5}s"
		></span>
	{/each}
</div>

<style>
	.blobs {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}
	.blob {
		position: absolute;
		width: clamp(260px, var(--s), 980px);
		aspect-ratio: 1;
		border-radius: 50%;
		/* Solid centre fading to nothing; peak strength is --blob-alpha, the value FR-7 checks */
		background: radial-gradient(closest-side, var(--c), transparent);
		opacity: var(--blob-alpha);
		transform: translate(-50%, -50%);
	}

	/* Mobile: two smaller, static blobs */
	@media (max-width: 767px) {
		.blob { width: clamp(240px, calc(var(--s) * 1.3), 520px); }
		.blob:nth-child(n + 3) { display: none; }
	}
	/* Tablet: three */
	@media (min-width: 768px) and (max-width: 1023px) {
		.blob:nth-child(n + 4) { display: none; }
	}
	/* Desktop: all, drifting on 20–30s loops, transforms only */
	@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
		.blob {
			will-change: transform;
			animation: var(--anim) var(--dur) ease-in-out var(--delay) infinite;
		}
		.drift-1 { --anim: drift-1; }
		.drift-2 { --anim: drift-2; }
		.drift-3 { --anim: drift-3; }
		.paused .blob { animation-play-state: paused; }
	}

	@keyframes drift-1 {
		0%, 100% { transform: translate(-50%, -50%); }
		33% { transform: translate(-42%, -57%) scale(1.06); }
		66% { transform: translate(-56%, -45%) scale(0.95); }
	}
	@keyframes drift-2 {
		0%, 100% { transform: translate(-50%, -50%) scale(1); }
		50% { transform: translate(-60%, -40%) scale(1.08); }
	}
	@keyframes drift-3 {
		0%, 100% { transform: translate(-50%, -50%); }
		25% { transform: translate(-44%, -44%) scale(0.96); }
		75% { transform: translate(-55%, -58%) scale(1.04); }
	}
</style>
