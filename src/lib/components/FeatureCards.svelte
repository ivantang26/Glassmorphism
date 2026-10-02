<script>
	import { inview } from '$lib/actions/inview.js';
	import { tilt } from '$lib/actions/tilt.js';
	import Icon from './Icon.svelte';

	// Charts draw themselves in the first time the row scrolls into view
	let shown = $state(false);

	const weeks = [
		{ label: 'Groceries', value: 62 },
		{ label: 'Transport', value: 28 },
		{ label: 'Eating out', value: 44 },
		{ label: 'Bills', value: 36 },
		{ label: 'Fun', value: 20 }
	];
</script>

<!-- Focusable so keyboard users can scroll the row when it overflows (tablet) -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="scroller" role="region" aria-label="Features" tabindex="0">
	<ul class="cards" role="list" use:inview={{ once: true, onchange: (v) => v && (shown = true) }} class:shown>
		<li class="glass card" use:tilt>
			<span class="icon"><Icon name="chart" size={22} /></span>
			<h3>Spending insights</h3>
			<p>Every payment is sorted into categories you'll recognise, so you can see where the money actually goes.</p>
			<figure class="mini" aria-label="Example: groceries is the largest category this month">
				<div class="hbars" aria-hidden="true">
					{#each weeks as w, i (w.label)}
						<div class="hbar">
							<span class="hlabel">{w.label}</span>
							<span class="track"><span class="fill" style:--w="{w.value}%" style:--i={i}></span></span>
						</div>
					{/each}
				</div>
			</figure>
		</li>

		<li class="glass card" use:tilt>
			<span class="icon"><Icon name="target" size={22} /></span>
			<h3>Goals</h3>
			<p>Pick a target and a date. Lumen works out what to set aside each payday and keeps track for you.</p>
			<figure class="mini goal" aria-label="Example: holiday fund 68% saved">
				<svg viewBox="0 0 120 120" aria-hidden="true">
					<circle cx="60" cy="60" r="50" class="ring-bg" />
					<circle cx="60" cy="60" r="50" class="ring-fg" pathLength="100" transform="rotate(-90 60 60)" />
				</svg>
				<div class="goal-text" aria-hidden="true">
					<span class="num pct">68%</span>
					<span class="small">Holiday fund</span>
				</div>
			</figure>
		</li>

		<li class="glass card" use:tilt>
			<span class="icon"><Icon name="users" size={22} /></span>
			<h3>Shared budgets</h3>
			<p>Split rent and bills with a partner or flatmates. Everyone sees the same numbers, so there's nothing to argue about.</p>
			<figure class="mini" aria-label="Example: rent split, Sam pays 52%, Alex pays 48%">
				<div class="split" aria-hidden="true">
					<span class="part a" style:--w="52%">Sam 52%</span>
					<span class="part b" style:--w="48%">Alex 48%</span>
				</div>
				<p class="split-note" aria-hidden="true">Rent £1,350 · both paid <span>✓</span></p>
			</figure>
		</li>
	</ul>
</div>

<style>
	.cards {
		display: grid;
		gap: 16px;
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 28px;
	}
	.card p { color: var(--text-muted); }
	.icon {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border-radius: 14px;
		background: linear-gradient(135deg, var(--btn-from), var(--btn-to));
		color: #FFFFFF;
		margin-bottom: 4px;
	}
	.mini {
		margin-top: auto;
		padding: 16px;
		border-radius: var(--radius-inner);
		background: var(--glass-fill-nested);
		border: 1px solid var(--glass-border);
		min-height: 150px;
		display: grid;
		align-content: center;
	}

	/* Spending bars */
	.hbars { display: grid; gap: 8px; }
	.hbar { display: grid; grid-template-columns: 5.5em 1fr; align-items: center; gap: 10px; font-size: 0.8125rem; font-weight: 600; }
	.track { height: 10px; border-radius: 99px; background: var(--track); overflow: hidden; }
	.fill {
		display: block;
		height: 100%;
		width: var(--w);
		border-radius: inherit;
		background: linear-gradient(90deg, #7C5CFF, #2EC4B6);
		transform-origin: left;
		transform: scaleX(0);
		transition: transform 900ms var(--ease-out) calc(var(--i) * 90ms);
	}
	.shown .fill { transform: scaleX(1); }

	/* Goal ring */
	.goal { grid-template-columns: 110px 1fr; align-items: center; gap: 16px; }
	.goal svg { width: 110px; height: 110px; }
	.ring-bg { fill: none; stroke: var(--track); stroke-width: 12; }
	.ring-fg {
		fill: none;
		stroke: #5B3DF5;
		stroke-width: 12;
		stroke-linecap: round;
		stroke-dasharray: 0 100;
		transition: stroke-dasharray 1200ms var(--ease-out);
	}
	.shown .ring-fg { stroke-dasharray: 68 100; }
	.goal-text { display: grid; }
	.pct { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; }
	.small { font-size: var(--fs-small); color: var(--text-muted); }

	/* Shared split */
	.split { display: flex; gap: 4px; height: 44px; border-radius: 12px; overflow: hidden; }
	.part {
		display: grid;
		place-items: center;
		flex: 0 0 var(--w);
		font-size: 0.8125rem;
		font-weight: 700;
		color: #FFFFFF;
		transform-origin: left;
		transform: scaleX(0);
		transition: transform 900ms var(--ease-out);
	}
	.part.a { background: #5B3DF5; }
	.part.b { background: #0E7C74; transition-delay: 150ms; }
	.shown .part { transform: scaleX(1); }
	.split-note { margin-top: 12px; font-size: var(--fs-small); font-weight: 600; color: var(--text-on-glass) !important; }

	@media (prefers-reduced-motion: reduce) {
		.fill, .part { transform: none; transition: none; }
		.ring-fg { stroke-dasharray: 68 100; transition: none; }
	}

	/* Tablet: horizontal scroll with snap */
	@media (min-width: 640px) and (max-width: 1023px) {
		.scroller {
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			margin-inline: calc(var(--gutter) * -1);
			padding: 8px var(--gutter) 20px;
			scrollbar-width: thin;
		}
		.cards {
			grid-auto-flow: column;
			grid-auto-columns: min(400px, 70vw);
		}
		.card { scroll-snap-align: start; scroll-margin-inline: var(--gutter); }
	}
	/* Desktop: three across */
	@media (min-width: 1024px) {
		.cards { grid-template-columns: repeat(3, 1fr); }
	}
</style>
