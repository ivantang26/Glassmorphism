<script>
	import { MediaQuery } from 'svelte/reactivity';
	import { categoryColor } from '$lib/categories.js';
	import { money, percent } from '$lib/format.js';
	import CountUp from '$lib/components/CountUp.svelte';
	import ChartPatterns from './ChartPatterns.svelte';

	let { categories, month, level = 2 } = $props();

	const uid = $props.id();
	const highContrast = new MediaQuery('(prefers-contrast: more)', false);

	const R = 96;
	const r = 64;
	const GAP = 0.025;

	const total = $derived(categories.reduce((sum, c) => sum + c.spent, 0));

	const segments = $derived.by(() => {
		let angle = 0;
		return categories
			.filter((c) => c.spent > 0)
			.map((c) => {
				const share = c.spent / total;
				const a0 = angle;
				angle += share * Math.PI * 2;
				return { ...c, share, d: arc(a0 + GAP, angle - GAP) };
			});
	});

	const largest = $derived(segments.toSorted((a, b) => b.spent - a.spent)[0]);
	const summary = $derived(
		`${money(total, { whole: true })} spent so far in ${month.name}. The largest share is ${largest.name.toLowerCase()} at ${money(largest.spent, { whole: true })} (${percent(largest.share)}).`
	);

	function arc(a0, a1) {
		const p = (radius, a) => `${(100 + radius * Math.sin(a)).toFixed(2)} ${(100 - radius * Math.cos(a)).toFixed(2)}`;
		const large = a1 - a0 > Math.PI ? 1 : 0;
		return `M${p(R, a0)}A${R} ${R} 0 ${large} 1 ${p(R, a1)}L${p(r, a1)}A${r} ${r} 0 ${large} 0 ${p(r, a0)}Z`;
	}

	const fill = (id) => (highContrast.current ? `url(#${uid}-${id})` : categoryColor(id));
</script>

<figure class="donut">
	<figcaption>
		<svelte:element this={`h${level}`} class="panel-title">Spending by category</svelte:element>
		<p class="summary">{summary}</p>
	</figcaption>

	<div class="body">
		<div class="ring">
			<svg viewBox="0 0 200 200" role="img" aria-label={summary}>
				<ChartPatterns prefix={uid} />
				{#each segments as s (s.id)}
					<path d={s.d} fill={fill(s.id)} stroke={highContrast.current ? '#14123A' : 'none'} />
				{/each}
			</svg>
			<div class="centre" aria-hidden="true">
				<span class="total num"><CountUp value={total} format={(n) => money(n, { whole: true })} /></span>
				<span class="caption">spent so far</span>
			</div>
		</div>

		<ul class="legend" role="list" aria-hidden="true">
			{#each segments as s (s.id)}
				<li>
					<svg class="swatch" viewBox="0 0 12 12"><rect width="12" height="12" rx="3" fill={fill(s.id)} /></svg>
					<span class="name">{s.name}</span>
					<span class="num">{money(s.spent, { whole: true })}</span>
					<span class="share num">{percent(s.share)}</span>
				</li>
			{/each}
		</ul>
	</div>

	<table class="sr-only">
		<caption>Spending by category, {month.name} so far</caption>
		<thead><tr><th scope="col">Category</th><th scope="col">Spent</th><th scope="col">Share</th></tr></thead>
		<tbody>
			{#each segments as s (s.id)}
				<tr><th scope="row">{s.name}</th><td>{money(s.spent)}</td><td>{percent(s.share)}</td></tr>
			{/each}
		</tbody>
	</table>
</figure>

<style>
	.donut { display: grid; gap: 16px; container-type: inline-size; }
	.body {
		display: grid;
		grid-template-columns: minmax(140px, 200px) 1fr;
		gap: 24px;
		align-items: center;
	}
	.ring { position: relative; }
	svg { width: 100%; height: auto; }
	.centre {
		position: absolute;
		inset: 0;
		display: grid;
		place-content: center;
		text-align: center;
		line-height: 1.2;
	}
	.total { font-size: clamp(1.25rem, 1rem + 1vw, 1.625rem); font-weight: 700; letter-spacing: -0.02em; }
	.caption { font-size: 0.75rem; color: var(--text-muted); }

	.legend { display: grid; gap: 8px; font-size: 0.9375rem; width: 100%; }
	.legend li {
		display: grid;
		grid-template-columns: 12px 1fr auto 3.2em;
		align-items: center;
		gap: 10px;
	}
	.swatch { width: 12px; height: 12px; }
	.share { color: var(--text-muted); text-align: right; font-weight: 400; }

	@container (max-width: 440px) {
		.body { grid-template-columns: 1fr; }
		.ring { width: 100%; max-width: 220px; margin-inline: auto; }
	}
</style>
