<script>
	import { money, percent } from '$lib/format.js';
	import Icon from '$lib/components/Icon.svelte';

	let { goals, level = 2 } = $props();
	const whole = (n) => money(n, { whole: true });
</script>

<section class="goals">
	<svelte:element this={`h${level}`} class="panel-title">Goals</svelte:element>
	<ul role="list">
		{#each goals as g (g.name)}
			{@const share = Math.min(1, g.saved / g.target)}
			<li>
				<div class="row">
					<span class="name">{g.name}</span>
					{#if share >= 1}
						<span class="done"><Icon name="check" size={16} /> Reached</span>
					{:else}
						<span class="num pct">{percent(share)}</span>
					{/if}
				</div>
				<div class="bar" aria-hidden="true"><span style:width="{share * 100}%"></span></div>
				<p class="detail num">{whole(g.saved)} of {whole(g.target)}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	ul { display: grid; gap: 18px; margin-top: 16px; }
	.row { display: flex; justify-content: space-between; gap: 12px; font-weight: 600; }
	.done { display: inline-flex; align-items: center; gap: 4px; color: var(--text-positive); }
	.bar {
		height: 10px;
		margin: 8px 0 6px;
		border-radius: 99px;
		background: var(--track);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #4FD8CB, #5AA9FF);
		transition: width 600ms var(--ease-out);
	}
	.detail { font-size: var(--fs-small); color: var(--text-muted); font-weight: 400; }
	@media (prefers-reduced-motion: reduce) {
		.bar span { transition: none; }
	}
</style>
