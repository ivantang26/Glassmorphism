<script>
	import { money } from '$lib/format.js';
	import { categoryColor } from '$lib/categories.js';
	import CountUp from '$lib/components/CountUp.svelte';
	import Icon from '$lib/components/Icon.svelte';

	/**
	 * Balance, "left to spend" and (optionally) per-category budget sliders.
	 * FR-2: sliders are native range inputs, so arrow keys, Page Up/Down and Home/End all work.
	 */
	let { persona, categories, onbudget, onreset, showBudgets = true, level = 2, edited = false } = $props();

	const uid = $props.id();

	const totalBudget = $derived(categories.reduce((s, c) => s + c.budget, 0));
	const totalSpent = $derived(categories.reduce((s, c) => s + c.spent, 0));
	const left = $derived(totalBudget - totalSpent);
	const daysLeft = $derived(persona.month.daysInMonth - persona.month.day);
	const perDay = $derived(Math.max(left, 0) / daysLeft);
	const usedShare = $derived(Math.min(1, totalSpent / totalBudget));

	// Range for each slider: generous enough to over- or under-budget comfortably
	const maxFor = (c) => Math.ceil((Math.max(c.budget, c.spent) * 1.8) / 50) * 50;
	const whole = (n) => money(n, { whole: true });
</script>

<section class="balance" aria-labelledby="{uid}-title">
	<div class="top">
		<div>
			<svelte:element this={`h${level}`} class="panel-title" id="{uid}-title">Left to spend in {persona.month.name}</svelte:element>
			<p class="left num" class:over={left < 0}>
				<CountUp value={Math.abs(left)} format={whole} />
				{#if left < 0}<span class="over-label">over</span>{/if}
			</p>
		</div>
		<dl class="balance-figure">
			<dt>Balance</dt>
			<dd class="num"><CountUp value={persona.balance} format={money} /></dd>
		</dl>
	</div>

	<div class="meter" aria-hidden="true"><span style:width="{usedShare * 100}%"></span></div>

	{#if left >= 0}
		<p>That's <strong class="num">{money(perDay)}</strong> a day for the next {daysLeft} days.</p>
	{:else}
		<p class="warn">
			<Icon name="alert" size={18} />
			<span>Spending is <strong class="num">{whole(-left)}</strong> over this month's budgets.</span>
		</p>
	{/if}
	<p class="meta">{whole(totalSpent)} spent of {whole(totalBudget)} budgeted · day {persona.month.day} of {persona.month.daysInMonth}</p>

	{#if showBudgets}
		<div class="budgets">
			<div class="budgets-head">
				<svelte:element this={`h${level + 1}`} class="sub-title">Category budgets</svelte:element>
				{#if edited}
					<button class="reset" type="button" onclick={onreset}>Reset</button>
				{/if}
			</div>
			<p class="hint">Drag a slider, or focus it and use the arrow keys.</p>
			<ul role="list">
				{#each categories as c (c.id)}
					{@const over = c.spent > c.budget}
					<li>
						<div class="row">
							<label for="{uid}-{c.id}">
								<span class="dot" style:background={categoryColor(c.id)}></span>
								{c.name}
							</label>
							<span class="num amounts">{whole(c.spent)} <span class="of">of</span> {whole(c.budget)}</span>
						</div>
						<input
							id="{uid}-{c.id}"
							type="range"
							min="0"
							max={maxFor(c)}
							step="5"
							value={c.budget}
							style:--fill="{(c.budget / maxFor(c)) * 100}%"
							style:--spent="{Math.min(1, c.spent / maxFor(c)) * 100}%"
							aria-valuetext="{whole(c.budget)} budget, {whole(c.spent)} spent{over ? `, ${whole(c.spent - c.budget)} over` : ''}"
							oninput={(e) => onbudget(c.id, +e.currentTarget.value)}
						/>
						{#if over}
							<p class="over-note"><Icon name="alert" size={16} /> {whole(c.spent - c.budget)} over budget</p>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>

<style>
	.balance { display: grid; gap: 12px; container-type: inline-size; }
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		flex-wrap: wrap;
	}
	.left {
		font-size: clamp(2.5rem, 2rem + 2vw, 3.5rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.05;
		margin-top: 6px;
	}
	.over-label { font-size: 1.25rem; font-weight: 600; letter-spacing: 0; margin-left: 4px; }
	.left.over { color: var(--text-negative); }

	@container (min-width: 400px) {
		.balance-figure { text-align: right; }
	}
	.balance-figure dt { font-size: var(--fs-small); color: var(--text-muted); }
	.balance-figure dd { font-size: clamp(1.125rem, 1rem + 0.5vw, 1.375rem); margin: 0; }

	.meter {
		height: 8px;
		border-radius: 99px;
		background: var(--track);
		overflow: hidden;
	}
	.meter span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #A08BFF, #4FD8CB);
		transition: width 400ms var(--ease-out);
	}
	.warn { display: flex; align-items: center; gap: 8px; }
	.warn :global(svg) { flex: none; }
	.meta { font-size: var(--fs-small); color: var(--text-muted); }

	.budgets {
		margin-top: 12px;
		padding-top: 16px;
		border-top: 1px solid var(--glass-border);
	}
	.budgets-head { display: flex; justify-content: space-between; align-items: center; }
	.sub-title { font-size: 1rem; }
	.hint { font-size: var(--fs-small); color: var(--text-muted); margin: 2px 0 12px; }
	.reset {
		border: 1px solid var(--glass-border);
		background: transparent;
		border-radius: var(--radius-pill);
		padding: 4px 14px;
		font-size: var(--fs-small);
		font-weight: 600;
		cursor: pointer;
		min-height: 32px;
	}
	.reset:hover { background: rgba(255, 255, 255, 0.08); }

	ul { display: grid; gap: 14px; }
	.row {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-size: 0.9375rem;
	}
	label { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; }
	.dot { width: 10px; height: 10px; border-radius: 3px; flex: none; }
	.amounts { white-space: nowrap; }
	.of { color: var(--text-muted); font-weight: 400; }
	.over-note {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 4px;
		font-size: var(--fs-small);
		font-weight: 600;
		color: var(--text-negative);
	}

	/* Range input: track shows budget filled, a tick marks what's been spent */
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 28px;
		margin: 2px 0 0;
		background: transparent;
		cursor: pointer;
	}
	input[type='range']::-webkit-slider-runnable-track {
		height: 8px;
		border-radius: 99px;
		background:
			linear-gradient(90deg, transparent calc(var(--spent) - 1px), #FFFFFF calc(var(--spent) - 1px), #FFFFFF calc(var(--spent) + 1px), transparent calc(var(--spent) + 1px)),
			linear-gradient(90deg, rgba(160, 139, 255, 0.85) var(--fill), var(--track) var(--fill));
	}
	input[type='range']::-moz-range-track {
		height: 8px;
		border-radius: 99px;
		background:
			linear-gradient(90deg, transparent calc(var(--spent) - 1px), #FFFFFF calc(var(--spent) - 1px), #FFFFFF calc(var(--spent) + 1px), transparent calc(var(--spent) + 1px)),
			linear-gradient(90deg, rgba(160, 139, 255, 0.85) var(--fill), var(--track) var(--fill));
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 22px;
		height: 22px;
		margin-top: -7px;
		border-radius: 50%;
		background: #FFFFFF;
		border: 3px solid #7C5CFF;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}
	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #FFFFFF;
		border: 3px solid #7C5CFF;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}
	input[type='range']:focus-visible {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
		border-radius: 8px;
	}
</style>
