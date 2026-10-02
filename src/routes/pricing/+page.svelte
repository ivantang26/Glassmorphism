<script>
	import Band from '$lib/components/Band.svelte';
	import PricingCards from '$lib/components/PricingCards.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const rows = [
		['Budgets and spending insights', true, true],
		['Bank connections', '2', 'Unlimited'],
		['Savings goals', '3', 'Unlimited'],
		['Bill reminders', true, true],
		['Shared budgets', false, 'Up to 4 people'],
		['Custom categories', false, true],
		['Export to CSV', false, true],
		['Read-only bank access and 256-bit encryption', true, true]
	];

	const faqs = [
		['Can I cancel Plus at any time?', 'Yes. Cancel in the app or in your App Store or Google Play subscriptions. You keep Plus until the end of the period you paid for, then move back to Free without losing your data.'],
		['How does annual billing work?', 'You pay £39.90 once a year instead of £3.99 a month. That is the price of 10 months, so you get 2 months free.'],
		['Is my data safer on Plus?', 'No. Everyone gets the same security: read-only bank access, 256-bit encryption and UK data storage. Plus adds features, not protection.'],
		['Do you offer student pricing?', 'Not yet. The Free plan covers what most students need, including budgets, insights and goals.']
	];
</script>

<svelte:head>
	<title>Pricing — Lumen</title>
	<meta name="description" content="Lumen is free to start. Plus is £3.99 a month or £39.90 a year, with unlimited bank connections and shared budgets." />
</svelte:head>

<Band theme="light" preset="soft">
	<section class="container page" aria-labelledby="page-title">
		<header class="section-head center">
			<p class="eyebrow">Pricing</p>
			<h1 id="page-title">Simple, honest pricing</h1>
			<p class="lede">Start free. Upgrade when you want to share a budget or connect more accounts. No ads, ever.</p>
		</header>

		<PricingCards level={2} source="pricing-page" />

		<div class="glass compare">
			<table>
				<caption>Compare plans</caption>
				<thead>
					<tr><th scope="col">Feature</th><th scope="col">Free</th><th scope="col">Plus</th></tr>
				</thead>
				<tbody>
					{#each rows as [feature, free, plus] (feature)}
						<tr>
							<th scope="row">{feature}</th>
							{#each [free, plus] as cell, i (i)}
								<td>
									{#if cell === true}<Icon name="check" label="Included" />
									{:else if cell === false}<span class="no">Not included</span>
									{:else}{cell}{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="faq">
			<h2>Questions</h2>
			{#each faqs as [q, a] (q)}
				<details class="glass">
					<summary>{q}</summary>
					<p>{a}</p>
				</details>
			{/each}
		</div>
	</section>
</Band>

<style>
	.page {
		padding-top: calc(var(--nav-height) + clamp(40px, 6vw, 80px));
		padding-bottom: clamp(56px, 8vw, 112px);
		display: grid;
		gap: clamp(32px, 5vw, 56px);
	}
	.compare {
		max-width: 880px;
		width: 100%;
		margin-inline: auto;
		padding: clamp(16px, 3vw, 32px);
		overflow-x: auto;
	}
	table { width: 100%; border-collapse: collapse; }
	caption { text-align: left; font-size: var(--fs-h3); font-weight: 700; margin-bottom: 12px; }
	th, td { padding: 14px 8px; text-align: left; vertical-align: middle; }
	thead th { font-size: var(--fs-small); text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
	tbody tr { border-top: 1px solid rgba(20, 18, 58, 0.1); }
	tbody th { font-weight: 600; }
	td { width: 26%; font-weight: 600; }
	td :global(svg) { color: var(--text-positive); }
	.no { color: var(--text-muted); font-weight: 400; }

	.faq { max-width: 880px; width: 100%; margin-inline: auto; display: grid; gap: 12px; }
	.faq h2 { font-size: var(--fs-h3); color: var(--text-on-bg); margin-bottom: 4px; }
	details { border-radius: var(--radius-inner); padding: 0; }
	summary {
		padding: 18px 24px;
		font-weight: 700;
		cursor: pointer;
		list-style-position: inside;
	}
	details p { padding: 0 24px 20px; color: var(--text-muted); }
</style>
