<script>
	import { untrack } from 'svelte';
	import { getPersona } from '$lib/data/personas.js';
	import { money } from '$lib/format.js';
	import PersonaSwitch from './PersonaSwitch.svelte';
	import BalancePanel from './BalancePanel.svelte';
	import DonutChart from './DonutChart.svelte';
	import SpendingLine from './SpendingLine.svelte';
	import GoalsList from './GoalsList.svelte';
	import TransactionList from './TransactionList.svelte';

	/**
	 * Interactive preview with sample data (FR-1, FR-2).
	 * `compact` is the reduced version embedded on Home.
	 */
	let { compact = false, level = 2, initial = 'graduate' } = $props();

	let personaId = $state(untrack(() => initial));
	// Budget edits, kept per persona so switching back doesn't lose them
	let overrides = $state({});
	let announcement = $state('');
	let timer;

	const persona = $derived(getPersona(personaId));
	const categories = $derived(
		persona.categories.map((c) => ({ ...c, budget: overrides[persona.id]?.[c.id] ?? c.budget }))
	);
	const edited = $derived(Object.keys(overrides[persona.id] ?? {}).length > 0);

	function announce(message, delay = 0) {
		clearTimeout(timer);
		timer = setTimeout(() => (announcement = message), delay);
	}

	function leftToSpend() {
		const left = categories.reduce((s, c) => s + c.budget - c.spent, 0);
		return left >= 0 ? `${money(left, { whole: true })} left to spend` : `${money(-left, { whole: true })} over budget`;
	}

	function onbudget(categoryId, value) {
		overrides[persona.id] = { ...overrides[persona.id], [categoryId]: value };
		announce(leftToSpend(), 700);
	}

	function onreset() {
		delete overrides[persona.id];
		announce(`Budgets reset. ${leftToSpend()}.`);
	}

	function onpersona(event) {
		if (event.target.name !== 'persona') return;
		announce(`Showing ${persona.label} sample data. ${leftToSpend()}.`, 50);
	}
</script>

<div class="dashboard" class:compact>
	<div class="toolbar" onchange={onpersona}>
		<PersonaSwitch bind:value={personaId} />
		<p class="who">{persona.who}</p>
	</div>

	<div class="grid">
		<div class="glass panel p-balance">
			<BalancePanel {persona} {categories} {onbudget} {onreset} {edited} {level} showBudgets={!compact} />
		</div>
		<div class="glass panel p-donut">
			<DonutChart {categories} month={persona.month} {level} />
		</div>
		<div class="glass panel p-line">
			<SpendingLine spending={persona.spending} asOf={persona.asOf} {level} height={compact ? 180 : 220} />
		</div>
		{#if !compact}
			<div class="glass panel p-goals"><GoalsList goals={persona.goals} {level} /></div>
			<div class="glass panel p-tx"><TransactionList transactions={persona.transactions} {level} /></div>
		{/if}
	</div>

	<p class="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
</div>

<style>
	.dashboard { display: grid; gap: 20px; }
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;
	}
	.who { font-size: var(--fs-small); color: var(--text-muted); }

	.grid {
		display: grid;
		gap: 16px;
		grid-template-columns: minmax(0, 1fr);
	}
	.panel {
		padding: clamp(20px, 2.5vw, 28px);
		min-width: 0;
	}
	.panel :global(.panel-title) {
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0;
		color: var(--text-muted);
	}
	.panel :global(.summary) { margin-top: 4px; font-size: 0.9375rem; }

	.p-balance { grid-area: bal; }
	.p-donut { grid-area: donut; }
	.p-line { grid-area: line; }
	.p-goals { grid-area: goals; }
	.p-tx { grid-area: tx; }

	/* Mobile: one column, in reading order */
	.grid { grid-template-areas: 'bal' 'donut' 'line' 'goals' 'tx'; }
	.compact .grid { grid-template-areas: 'bal' 'donut' 'line'; }

	/* Tablet: two columns, the tall budget card beside donut + goals */
	@media (min-width: 720px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-template-areas: 'bal donut' 'bal goals' 'line line' 'tx tx';
		}
		.compact .grid { grid-template-areas: 'bal donut' 'line line'; }
	}

	/* Desktop: bento */
	@media (min-width: 1080px) {
		.grid {
			grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
			grid-template-areas: 'bal donut' 'bal line' 'goals tx';
		}
		.compact .grid {
			grid-template-columns: minmax(0, 4fr) minmax(0, 5fr) minmax(0, 7fr);
			grid-template-areas: 'bal donut line';
		}
	}
</style>
