<svelte:options namespace="svg" />

<script>
	import { CATEGORIES } from '$lib/categories.js';

	/** SVG patterns for high-contrast mode: category colour plus a distinct dark texture. */
	let { prefix } = $props();
	const ink = '#14123A';
</script>

<defs>
	{#each Object.entries(CATEGORIES) as [id, { color, pattern }] (id)}
		<pattern id="{prefix}-{id}" width="8" height="8" patternUnits="userSpaceOnUse">
			<rect width="8" height="8" fill={color} />
			{#if pattern === 'diagonal'}
				<path d="M-2 2l4-4M0 8l8-8M6 10l4-4" stroke={ink} stroke-width="1.6" />
			{:else if pattern === 'dots'}
				<circle cx="4" cy="4" r="1.7" fill={ink} />
			{:else if pattern === 'cross'}
				<path d="M0 0l8 8M8 0L0 8" stroke={ink} stroke-width="1.2" />
			{:else if pattern === 'horizontal'}
				<path d="M0 4h8" stroke={ink} stroke-width="1.8" />
			{:else if pattern === 'vertical'}
				<path d="M4 0v8" stroke={ink} stroke-width="1.8" />
			{:else if pattern === 'grid'}
				<path d="M0 .5h8M.5 0v8" stroke={ink} stroke-width="1.2" />
			{:else if pattern === 'zigzag'}
				<path d="M0 6l2-4 2 4 2-4 2 4" fill="none" stroke={ink} stroke-width="1.2" />
			{/if}
		</pattern>
	{/each}
</defs>
