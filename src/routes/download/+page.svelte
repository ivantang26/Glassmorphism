<script>
	import { onMount } from 'svelte';
	import Band from '$lib/components/Band.svelte';
	import StoreBadges from '$lib/components/StoreBadges.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import { detectPlatform } from '$lib/store-links.js';

	let platform = $state('desktop');
	onMount(() => (platform = detectPlatform()));

	const steps = [
		['Install Lumen', 'Free from the App Store or Google Play.'],
		['Connect a bank, or skip it', 'Read-only access through your bank’s own app. Takes about two minutes.'],
		['Set your first budget', 'Lumen suggests one from your last three months. Adjust anything you like.']
	];
</script>

<svelte:head>
	<title>Download — Lumen</title>
	<meta name="description" content="Download Lumen free for iPhone and Android." />
</svelte:head>

<Band theme="dark" preset="hero" blobs={3}>
	<section class="container page" aria-labelledby="page-title">
		<div class="intro">
			<p class="eyebrow">Download</p>
			<h1 id="page-title">Get Lumen on your phone</h1>
			<p class="lede">Free on iPhone (iOS 16 or later) and Android (version 10 or later).</p>
			<div class="badges"><StoreBadges source="download-page" /></div>
		</div>

		{#if platform === 'desktop'}
			<div class="glass qr">
				<QrCode size={200} />
				<div>
					<h2>On a computer?</h2>
					<p>Scan this code with your phone's camera. It opens this page on your phone, ready to install.</p>
				</div>
			</div>
		{/if}

		<ol class="steps" role="list">
			{#each steps as [title, body], i (title)}
				<li class="glass step">
					<span class="n num" aria-hidden="true">{i + 1}</span>
					<h2>{title}</h2>
					<p>{body}</p>
				</li>
			{/each}
		</ol>
	</section>
</Band>

<style>
	.page {
		padding-top: calc(var(--nav-height) + clamp(40px, 6vw, 80px));
		padding-bottom: clamp(56px, 8vw, 112px);
		display: grid;
		gap: 32px;
	}
	@media (min-width: 1024px) {
		.page { grid-template-columns: 1fr auto; align-items: center; }
		.steps { grid-column: 1 / -1; }
	}
	.intro { display: grid; gap: 16px; }
	.badges { margin-top: 12px; }
	.qr { display: flex; align-items: center; gap: 24px; padding: 24px; max-width: 480px; }
	.qr h2 { font-size: var(--fs-h3); }
	.qr p { margin-top: 6px; color: var(--text-muted); }
	@media (max-width: 599px) { .qr { flex-direction: column; text-align: center; } }

	.steps { display: grid; gap: 16px; margin-top: 16px; }
	@media (min-width: 768px) { .steps { grid-template-columns: repeat(3, 1fr); } }
	.step { padding: 24px 28px; display: grid; gap: 8px; align-content: start; }
	.step h2 { font-size: var(--fs-h3); }
	.step p { color: var(--text-muted); }
	.n {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #FFFFFF;
		color: #14123A;
		font-weight: 700;
	}
</style>
