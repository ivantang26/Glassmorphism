<script>
	import { STORE_URLS } from '$lib/store-links.js';
	import { track } from '$lib/track.js';

	let { source } = $props();

	const stores = [
		{ id: 'ios', top: 'Download on the', name: 'App Store', icon: 'apple' },
		{ id: 'android', top: 'Get it on', name: 'Google Play', icon: 'play' }
	];
</script>

<ul class="badges" role="list">
	{#each stores as store (store.id)}
		<li>
			<a class="badge" href={STORE_URLS[store.id]} onclick={() => track('store_badge_click', { store: store.id, source })}>
				<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
					{#if store.icon === 'apple'}
						<rect x="5" y="2" width="14" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.8" />
						<path d="M10 18.5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
					{:else}
						<path d="M5 3.6v16.8a.9.9 0 0 0 1.4.8l14-8.4a.9.9 0 0 0 0-1.6l-14-8.4A.9.9 0 0 0 5 3.6Z" fill="currentColor" />
					{/if}
				</svg>
				<span class="text">
					<span class="top">{store.top}</span>
					<span class="name">{store.name}</span>
				</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-width: 176px;
		min-height: 56px;
		padding: 8px 18px 8px 14px;
		border-radius: 14px;
		background: #0B0A1F;
		color: #FFFFFF;
		border: 1px solid rgba(255, 255, 255, 0.28);
		text-decoration: none;
		transition: transform 200ms var(--ease-out);
	}
	.badge:hover { transform: translateY(-2px); }
	.badge:focus-visible { outline-color: var(--focus); }
	.text { display: grid; line-height: 1.15; }
	.top { font-size: 0.75rem; font-weight: 400; }
	.name { font-size: 1.125rem; font-weight: 700; letter-spacing: -0.01em; }
</style>
