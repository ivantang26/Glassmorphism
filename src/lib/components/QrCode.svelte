<script>
	import { onMount } from 'svelte';

	/** QR code drawn as one SVG path. The encoder is loaded lazily, desktop only. */
	let { path = '/download', size = 168 } = $props();

	let modules = $state(null);
	let count = $state(0);

	onMount(async () => {
		const { default: qrcode } = await import('qrcode-generator');
		const qr = qrcode(0, 'M');
		qr.addData(`${location.origin}${path}?utm_source=qr`);
		qr.make();
		const n = qr.getModuleCount();
		let d = '';
		for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) d += `M${x} ${y}h1v1h-1z`;
		count = n;
		modules = d;
	});
</script>

<div class="qr" style:width="{size}px" style:height="{size}px">
	{#if modules}
		<svg viewBox="-3 -3 {count + 6} {count + 6}" shape-rendering="crispEdges" role="img" aria-label="QR code linking to the Lumen download page">
			<rect x="-3" y="-3" width={count + 6} height={count + 6} fill="#FFFFFF" />
			<path d={modules} fill="#14123A" />
		</svg>
	{/if}
</div>

<style>
	.qr {
		border-radius: 16px;
		overflow: hidden;
		background: #FFFFFF;
		flex: none;
	}
	svg { width: 100%; height: 100%; }
</style>
