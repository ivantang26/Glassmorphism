<script>
	import { money, shortDate } from '$lib/format.js';
	import { seriesDate } from '$lib/data/personas.js';

	/** Cumulative spend over the last 30 days, with the previous 30 days dashed for comparison. */
	let { spending, asOf, level = 2, height = 220 } = $props();

	const uid = $props.id();
	let width = $state(560);
	let active = $state(null);

	const PAD = { top: 16, right: 12, bottom: 30, left: 52 };

	const cumulative = (days) => days.reduce((acc, d, i) => (acc.push((acc[i - 1] ?? 0) + d), acc), []);
	const current = $derived(cumulative(spending.last30));
	const previous = $derived(cumulative(spending.previous30));
	const totalNow = $derived(current.at(-1));
	const totalBefore = $derived(previous.at(-1));
	const change = $derived((totalNow - totalBefore) / totalBefore);

	const summary = $derived.by(() => {
		const pct = Math.round(Math.abs(change) * 100);
		const compare = pct === 0 ? 'about the same as' : `${pct}% ${change < 0 ? 'less' : 'more'} than`;
		return `You spent ${money(totalNow, { whole: true })} in the last 30 days, ${compare} the 30 days before.`;
	});

	const yMax = $derived.by(() => {
		const max = Math.max(totalNow, totalBefore);
		const step = max > 2000 ? 500 : 250;
		return Math.ceil(max / step) * step;
	});
	const ticks = $derived([0, yMax / 2, yMax]);

	const x = (i) => PAD.left + (i * (width - PAD.left - PAD.right)) / 29;
	const y = (v) => PAD.top + (1 - v / yMax) * (height - PAD.top - PAD.bottom);
	const line = (series) => series.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('');

	const currentPath = $derived(line(current));
	const previousPath = $derived(line(previous));
	const areaPath = $derived(`${currentPath}L${x(29)} ${y(0)}L${x(0)} ${y(0)}Z`);

	const dateAt = (i) => shortDate(seriesDate(asOf, i));

	function pointer(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		const i = Math.round(((event.clientX - rect.left - PAD.left) / (rect.width - PAD.left - PAD.right)) * 29);
		active = Math.max(0, Math.min(29, i));
	}

	function keydown(event) {
		const moves = { ArrowLeft: -1, ArrowRight: 1, Home: -30, End: 30 };
		if (!(event.key in moves)) return;
		event.preventDefault();
		active = Math.max(0, Math.min(29, (active ?? 29) + moves[event.key]));
	}

	const readout = $derived(
		active === null
			? ''
			: `${dateAt(active)}: ${money(spending.last30[active])} that day, ${money(current[active])} so far. Previous period: ${money(previous[active])}.`
	);
</script>

<figure class="line">
	<figcaption>
		<svelte:element this={`h${level}`} class="panel-title">Last 30 days</svelte:element>
		<p class="summary" id="{uid}-summary">{summary}</p>
	</figcaption>

	<div
		class="plot"
		bind:clientWidth={width}
		tabindex="0"
		role="slider"
		aria-label="Daily spending explorer. Use the left and right arrow keys to move between days."
		aria-describedby="{uid}-summary"
		aria-valuemin="1"
		aria-valuemax="30"
		aria-valuenow={(active ?? 29) + 1}
		aria-valuetext={readout || 'No day selected'}
		onkeydown={keydown}
		onblur={() => (active = null)}
	>
		<svg {width} {height} aria-hidden="true" onpointermove={pointer} onpointerleave={() => (active = null)}>
			<defs>
				<linearGradient id="{uid}-stroke" x1="0" x2="1">
					<stop offset="0" stop-color="#A08BFF" />
					<stop offset="1" stop-color="#4FD8CB" />
				</linearGradient>
				<linearGradient id="{uid}-area" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stop-color="#A08BFF" stop-opacity="0.35" />
					<stop offset="1" stop-color="#A08BFF" stop-opacity="0" />
				</linearGradient>
			</defs>

			{#each ticks as t (t)}
				<line class="grid" x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} />
				<text class="tick" x={PAD.left - 10} y={y(t) + 4} text-anchor="end">{money(t, { whole: true })}</text>
			{/each}
			{#each [0, 14, 29] as i (i)}
				<text class="tick" x={x(i)} y={height - 8} text-anchor={i === 0 ? 'start' : i === 29 ? 'end' : 'middle'}>{dateAt(i)}</text>
			{/each}

			<path d={areaPath} fill="url(#{uid}-area)" />
			<path d={previousPath} class="previous" />
			<path d={currentPath} class="current" stroke="url(#{uid}-stroke)" />

			{#if active !== null}
				<line class="cursor" x1={x(active)} x2={x(active)} y1={PAD.top} y2={height - PAD.bottom} />
				<circle cx={x(active)} cy={y(previous[active])} r="4" class="dot-prev" />
				<circle cx={x(active)} cy={y(current[active])} r="5.5" class="dot" />
			{/if}
		</svg>

		{#if active !== null}
			<div class="tip" style:left="{Math.min(Math.max(x(active), 90), width - 90)}px" aria-hidden="true">
				<strong>{dateAt(active)}</strong>
				<span>{money(spending.last30[active])} that day</span>
				<span class="num">{money(current[active], { whole: true })} so far</span>
			</div>
		{/if}
	</div>

	<ul class="key" role="list" aria-hidden="true">
		<li><span class="swatch current-swatch"></span>Last 30 days</li>
		<li><span class="swatch previous-swatch"></span>30 days before</li>
	</ul>

	<table class="sr-only">
		<caption>Daily spending, last 30 days</caption>
		<thead><tr><th scope="col">Date</th><th scope="col">Spent that day</th><th scope="col">Running total</th><th scope="col">Previous period running total</th></tr></thead>
		<tbody>
			{#each spending.last30 as amount, i (i)}
				<tr><th scope="row">{dateAt(i)}</th><td>{money(amount)}</td><td>{money(current[i])}</td><td>{money(previous[i])}</td></tr>
			{/each}
		</tbody>
	</table>
</figure>

<style>
	.line { display: grid; gap: 12px; min-width: 0; }
	.plot { position: relative; min-width: 0; border-radius: 12px; }
	.plot:focus-visible { outline-offset: 6px; }
	svg { display: block; width: 100%; overflow: visible; touch-action: pan-y; }
	.grid { stroke: var(--track); stroke-width: 1; }
	.tick { font-size: 11.5px; fill: var(--text-muted); font-variant-numeric: tabular-nums; }
	.current { fill: none; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
	.previous { fill: none; stroke: var(--text-muted); stroke-width: 2; stroke-dasharray: 5 5; opacity: 0.8; }
	.cursor { stroke: var(--text-muted); stroke-width: 1; }
	.dot { fill: #FFFFFF; stroke: #A08BFF; stroke-width: 3; }
	.dot-prev { fill: var(--text-muted); }

	.tip {
		position: absolute;
		top: 0;
		transform: translate(-50%, -8px);
		display: grid;
		gap: 2px;
		min-width: 150px;
		padding: 10px 12px;
		border-radius: 12px;
		background: #FFFFFF;
		color: #14123A;
		font-size: 0.8125rem;
		line-height: 1.35;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
		pointer-events: none;
	}

	.key { display: flex; flex-wrap: wrap; gap: 4px 20px; font-size: var(--fs-small); color: var(--text-muted); }
	.key li { display: inline-flex; align-items: center; gap: 8px; }
	.swatch { display: inline-block; width: 22px; height: 0; border-top: 3px solid; }
	.current-swatch { border-color: #A08BFF; }
	.previous-swatch { border-top: 2px dashed var(--text-muted); }

	@media (prefers-contrast: more) {
		.current { stroke: #FFFFFF; }
		.previous { opacity: 1; }
	}
</style>
