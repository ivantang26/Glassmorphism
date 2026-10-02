<script>
	import { signedMoney, shortDate } from '$lib/format.js';
	import { LABELS, categoryColor } from '$lib/categories.js';

	let { transactions, level = 2 } = $props();
</script>

<section class="tx">
	<svelte:element this={`h${level}`} class="panel-title">Recent transactions</svelte:element>
	<table>
		<caption class="sr-only">Recent transactions, newest first</caption>
		<thead class="sr-only">
			<tr><th scope="col">Date</th><th scope="col">Payee</th><th scope="col">Category</th><th scope="col">Amount</th></tr>
		</thead>
		<tbody>
			{#each transactions as t, i (i)}
				<tr>
					<td class="date">{shortDate(t.date)}</td>
					<th scope="row" class="payee">{t.merchant}</th>
					<td class="cat">
						<span class="chip"><span class="dot" style:background={categoryColor(t.category)}></span>{LABELS[t.category]}</span>
					</td>
					<td class="num amount" class:income={t.amount > 0}>{signedMoney(t.amount)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<style>
	table {
		width: 100%;
		margin-top: 12px;
		border-collapse: collapse;
		font-size: 0.9375rem;
	}
	tr + tr { border-top: 1px solid var(--glass-border); }
	td, th { padding: 10px 0; text-align: left; vertical-align: middle; }
	.date { width: 4.5em; color: var(--text-muted); white-space: nowrap; font-size: var(--fs-small); }
	.payee { font-weight: 600; padding-right: 12px; }
	.cat { padding-right: 12px; }
	.dot { width: 8px; height: 8px; border-radius: 2px; }
	.amount { text-align: right; white-space: nowrap; }
	.income { color: var(--text-positive); }

	@media (max-width: 559px) {
		tr { display: grid; grid-template-columns: 1fr auto; grid-template-areas: 'payee amount' 'date cat'; gap: 2px 12px; padding: 10px 0; }
		td, th { padding: 0; }
		.payee { grid-area: payee; }
		.amount { grid-area: amount; }
		.date { grid-area: date; width: auto; }
		.cat { grid-area: cat; text-align: right; }
		.cat .chip { padding: 0; border: 0; background: none; font-weight: 400; color: var(--text-muted); }
	}
</style>
