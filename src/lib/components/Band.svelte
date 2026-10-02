<script>
	import Blobs from './Blobs.svelte';

	/** A run of sections sharing one theme (light | dark | calm) and one colour field. */
	let { theme = 'light', blobs = 4, preset = 'hero', class: className = '', children } = $props();
</script>

<div class="band theme-{theme} {className}">
	{#if blobs > 0}<Blobs count={blobs} {preset} />{/if}
	{@render children()}
</div>
