<script>
	import { onMount } from 'svelte';
	import { STORE_URLS, detectPlatform } from '$lib/store-links.js';
	import { qrModal } from '$lib/app-modal.svelte.js';
	import { track } from '$lib/track.js';

	/**
	 * FR-3: one button, three destinations. iOS → App Store, Android → Play Store,
	 * desktop → QR dialog. Without JS it falls back to the Download page.
	 */
	let { label = 'Get the app', source, variant = 'primary', small = false } = $props();

	let platform = $state('desktop');
	onMount(() => (platform = detectPlatform()));

	const href = $derived(platform === 'desktop' ? '/download' : STORE_URLS[platform]);

	function onclick(event) {
		track('store_cta_click', { source, platform });
		if (platform === 'desktop') {
			event.preventDefault();
			qrModal.source = source;
			qrModal.open = true;
		}
	}
</script>

<a class="btn btn-{variant}" class:btn-sm={small} {href} {onclick} aria-haspopup={platform === 'desktop' ? 'dialog' : undefined}>
	{label}
</a>
