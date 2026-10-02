<script>
	import { page } from '$app/state';
	import Band from '$lib/components/Band.svelte';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Page not found' : 'Something went wrong'} — Lumen</title>
</svelte:head>

<Band theme="light" preset="soft" blobs={2}>
	<section class="container page">
		<div class="glass box">
			<p class="eyebrow">{page.status}</p>
			<h1>{page.status === 404 ? "We couldn't find that page" : 'Something went wrong'}</h1>
			<p>Try the home page, or have a look at the live demo.</p>
			<div class="ctas">
				<a class="btn btn-primary" href="/">Go home</a>
				<a class="btn btn-glass" href="/dashboard">Live demo</a>
			</div>
		</div>
	</section>
</Band>

<style>
	.page {
		min-height: 80vh;
		display: grid;
		place-items: center;
		padding-top: calc(var(--nav-height) + 48px);
		padding-bottom: 64px;
	}
	.box { padding: clamp(28px, 5vw, 56px); max-width: 36rem; display: grid; gap: 16px; }
	h1 { font-size: var(--fs-h2); }
	.eyebrow { color: var(--text-muted); }
	.ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
</style>
