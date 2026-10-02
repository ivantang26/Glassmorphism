<script>
	import { tilt } from '$lib/actions/tilt.js';
	import { money } from '$lib/format.js';
	import GetAppButton from './GetAppButton.svelte';
	import Icon from './Icon.svelte';

	/** FR-6: monthly / annual toggle. Annual = 10 months' price, i.e. 2 months free. */
	let { level = 3, source = 'pricing' } = $props();

	const MONTHLY = 3.99;
	const ANNUAL = MONTHLY * 10;
	const SAVING = MONTHLY * 2;

	let billing = $state('monthly');
	const annual = $derived(billing === 'annual');
	const uid = $props.id();

	const free = ['Budgets and spending insights', 'Up to 2 bank connections', '3 savings goals', 'Bill reminders'];
	const plus = [
		'Everything in Free',
		'Unlimited bank connections',
		'Shared budgets with up to 4 people',
		'Unlimited goals and custom categories',
		'Export to CSV and spreadsheets'
	];
</script>

<div class="pricing">
	<fieldset class="toggle">
		<legend class="sr-only">Billing period</legend>
		<label class:active={!annual}>
			<input type="radio" name="{uid}-billing" value="monthly" bind:group={billing} />
			<span>Monthly</span>
		</label>
		<label class:active={annual}>
			<input type="radio" name="{uid}-billing" value="annual" bind:group={billing} />
			<span>Annual <em>2 months free</em></span>
		</label>
	</fieldset>

	<ul class="plans" role="list">
		<li class="glass plan" use:tilt>
			<svelte:element this={`h${level}`}>Free</svelte:element>
			<p class="price"><span class="amount num">£0</span><span class="per">forever</span></p>
			<p class="note">Everything you need to start budgeting.</p>
			<ul class="features" role="list">
				{#each free as f (f)}<li><Icon name="check" size={18} />{f}</li>{/each}
			</ul>
			<GetAppButton variant="glass" label="Get Lumen free" source="{source}-free" />
		</li>

		<li class="glass plan featured" use:tilt>
			<div class="title-row">
				<svelte:element this={`h${level}`}>Plus</svelte:element>
				<span class="chip">Most popular</span>
			</div>
			<p class="price" aria-live="polite">
				<span class="amount num">{annual ? money(ANNUAL) : money(MONTHLY)}</span>
				<span class="per">{annual ? 'per year' : 'per month'}</span>
			</p>
			<p class="note">
				{#if annual}
					Works out at {money(ANNUAL / 12)} a month. You save {money(SAVING)}, that's 2 months free.
				{:else}
					Billed monthly. Cancel any time in the app.
				{/if}
			</p>
			<ul class="features" role="list">
				{#each plus as f (f)}<li><Icon name="check" size={18} />{f}</li>{/each}
			</ul>
			<GetAppButton label="Get Lumen Plus" source="{source}-plus" />
		</li>
	</ul>
</div>

<style>
	.pricing { display: grid; justify-items: center; gap: 28px; }

	.toggle {
		display: inline-flex;
		gap: 4px;
		margin: 0;
		padding: 4px;
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-pill);
		background: var(--glass-fill);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		color: var(--text-on-glass);
	}
	.toggle label { position: relative; cursor: pointer; }
	.toggle input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
	.toggle span {
		display: block;
		padding: 10px 20px;
		border-radius: var(--radius-pill);
		font-weight: 600;
		transition: background-color 200ms ease, color 200ms ease;
	}
	.toggle em { font-style: normal; font-size: 0.8125rem; font-weight: 600; margin-left: 4px; }
	.toggle .active span { background: #14123A; color: #FFFFFF; }
	.toggle input:focus-visible + span { outline: 3px solid var(--focus); outline-offset: 2px; }

	.plans {
		display: grid;
		gap: 16px;
		width: 100%;
		max-width: 880px;
	}
	@media (min-width: 720px) {
		.plans { grid-template-columns: 1fr 1fr; }
	}
	.plan {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: clamp(24px, 3vw, 36px);
	}
	.featured {
		border: 2px solid transparent;
		background:
			linear-gradient(var(--glass-fill), var(--glass-fill)) padding-box,
			linear-gradient(135deg, var(--btn-from), var(--btn-to)) border-box;
	}
	.title-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
	.price { display: flex; align-items: baseline; gap: 8px; }
	.amount { font-size: clamp(2.25rem, 1.8rem + 1.5vw, 3rem); font-weight: 700; letter-spacing: -0.03em; }
	.per { color: var(--text-muted); font-weight: 600; }
	.note { color: var(--text-muted); min-height: 3.2em; }
	.features { display: grid; gap: 10px; margin: 8px 0 20px; }
	.features li { display: flex; gap: 10px; align-items: flex-start; }
	.features :global(svg) { flex: none; margin-top: 3px; color: var(--text-positive); }
	.plan :global(.btn) { margin-top: auto; }

	:global(.no-blur) .toggle { background: var(--glass-fallback); }
	@media (prefers-contrast: more) {
		.featured { border-color: #14123A; background: var(--glass-fill); }
	}
</style>
