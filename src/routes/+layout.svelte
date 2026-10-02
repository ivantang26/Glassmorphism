<script>
	import '@fontsource/plus-jakarta-sans/latin-400.css';
	import '@fontsource/plus-jakarta-sans/latin-600.css';
	import '@fontsource/plus-jakarta-sans/latin-700.css';
	import '../app.css';
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import QrModal from '$lib/components/QrModal.svelte';

	let { children } = $props();

	// QA switch: ?noblur forces the FR-5 solid-fill fallback in browsers that support blur
	onMount(() => {
		if (new URLSearchParams(location.search).has('noblur')) document.documentElement.classList.add('no-blur');
	});
</script>

<a class="skip-link" href="#main">Skip to content</a>
<Nav />
<main id="main" tabindex="-1">
	{@render children()}
</main>
<Footer />
<QrModal />

<style>
	main:focus { outline: none; }
</style>
