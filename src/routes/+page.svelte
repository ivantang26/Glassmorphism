<script>
	import Band from '$lib/components/Band.svelte';
	import HeroVisual from '$lib/components/HeroVisual.svelte';
	import FeatureCards from '$lib/components/FeatureCards.svelte';
	import PricingCards from '$lib/components/PricingCards.svelte';
	import GetAppButton from '$lib/components/GetAppButton.svelte';
	import StoreBadges from '$lib/components/StoreBadges.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Dashboard from '$lib/dashboard/Dashboard.svelte';
	import { tilt } from '$lib/actions/tilt.js';
	import { MediaQuery } from 'svelte/reactivity';

	// The QR code is only for desktop visitors; don't load the encoder on phones
	const desktop = new MediaQuery('(min-width: 1024px)', false);

	const testimonials = [
		{
			quote: "I used to check my balance with one eye shut. Now I open Lumen on payday and actually know what I've got left for the month.",
			name: 'Priya',
			detail: '24, junior analyst'
		},
		{
			quote: "We split rent and bills without a spreadsheet or awkward chats. We can both see what's paid and what we're saving for.",
			name: 'Sam & Alex',
			detail: 'renting together'
		},
		{
			quote: "My income is lumpy. Lumen smooths it into a steady monthly amount, so a quiet month doesn't feel like a crisis.",
			name: 'Jordan',
			detail: 'freelance illustrator'
		}
	];
</script>

<svelte:head>
	<title>Lumen — See your money clearly</title>
	<meta name="description" content="Lumen is a calm budgeting app. See what's coming in, what's going out and what's safe to spend. Try the live dashboard in your browser." />
</svelte:head>

<Band theme="light" preset="hero">
	<section class="hero container" aria-labelledby="hero-title">
		<div class="hero-copy">
			<p class="eyebrow">Budgeting without the dread</p>
			<h1 id="hero-title">See your money clearly.</h1>
			<p class="lede">
				Lumen brings your accounts into one calm view: what's coming in, what's going out and what's safe to spend. Checking your balance stops feeling like a gamble.
			</p>
			<div class="ctas">
				<GetAppButton source="hero" />
				<a class="btn btn-glass" href="/dashboard">Try the live demo <Icon name="arrow" size={18} /></a>
			</div>
		</div>
		<HeroVisual />
	</section>

	<section class="container block-tight" aria-label="Security at a glance">
		<div class="glass trust">
			<ul role="list">
				<li><Icon name="eye" /> Read-only bank connections</li>
				<li aria-hidden="true" class="sep">·</li>
				<li><Icon name="lock" /> 256-bit encryption</li>
				<li aria-hidden="true" class="sep">·</li>
				<li><Icon name="shield" /> FCA-registered partner</li>
			</ul>
			<a href="/security" class="trust-link">How we keep you safe <Icon name="arrow" size={16} /></a>
		</div>
	</section>

	<section class="container block" aria-labelledby="features-title">
		<div class="section-head">
			<p class="eyebrow">What Lumen does</p>
			<h2 id="features-title">Less maths. More calm.</h2>
			<p class="lede">Three things that make money feel manageable, whether you're on your first salary or juggling invoices.</p>
		</div>
		<FeatureCards />
	</section>
</Band>

<Band theme="dark" preset="wide">
	<section class="container block" aria-labelledby="demo-title">
		<div class="section-head teaser-head">
			<div>
				<p class="eyebrow">Live preview · sample data</p>
				<h2 id="demo-title">Try it before you download</h2>
				<p class="lede">Switch between three sample people and see how Lumen shows their month.</p>
			</div>
			<a class="btn btn-primary" href="/dashboard">Try it live <Icon name="arrow" size={18} /></a>
		</div>
		<div class="glass teaser">
			<Dashboard compact level={3} />
		</div>
	</section>
</Band>

<Band theme="light" preset="soft">
	<section class="container block" aria-labelledby="quotes-title">
		<div class="section-head center">
			<p class="eyebrow">From people like you</p>
			<h2 id="quotes-title">Money, minus the knot in your stomach</h2>
		</div>
		<ul class="quotes" role="list">
			{#each testimonials as t (t.name)}
				<li class="glass quote" use:tilt>
					<figure>
						<blockquote><p>“{t.quote}”</p></blockquote>
						<figcaption><strong>{t.name}</strong>, {t.detail}</figcaption>
					</figure>
				</li>
			{/each}
		</ul>
	</section>

	<section class="container block" aria-labelledby="pricing-title" style="padding-top: 0">
		<div class="section-head center">
			<p class="eyebrow">Pricing</p>
			<h2 id="pricing-title">Free to start. Plus when you need it.</h2>
		</div>
		<PricingCards source="home-pricing" />
		<p class="compare"><a href="/pricing">Compare plans in detail <Icon name="arrow" size={16} /></a></p>
	</section>
</Band>

<Band theme="dark" preset="hero" blobs={3}>
	<section class="container block download" aria-labelledby="download-title">
		<div>
			<p class="eyebrow">Download</p>
			<h2 id="download-title">Ready when you are</h2>
			<p class="lede">Lumen is free on iPhone and Android. Connect a bank in about two minutes, or start with a manual budget.</p>
			<div class="badges"><StoreBadges source="home-download" /></div>
		</div>
		{#if desktop.current}
			<div class="glass qr-card">
				<QrCode size={148} />
				<p><strong>On a computer?</strong><br />Scan with your phone's camera to go straight to the right store.</p>
			</div>
		{/if}
	</section>
</Band>

<style>
	/* Hero */
	.hero {
		display: grid;
		gap: 32px;
		align-items: center;
		padding-top: calc(var(--nav-height) + clamp(32px, 6vw, 80px));
		padding-bottom: clamp(24px, 4vw, 48px);
	}
	.hero-copy { display: grid; gap: 20px; }
	.hero h1 { max-width: 11ch; }
	.ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
	@media (min-width: 960px) {
		.hero { grid-template-columns: 1.1fr 0.9fr; min-height: min(92vh, 880px); }
	}

	/* Trust strip */
	.trust {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px 24px;
		padding: 18px 28px;
		border-radius: var(--radius-pill);
		font-weight: 600;
	}
	.trust ul { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
	.trust li { display: inline-flex; align-items: center; gap: 8px; }
	.trust-link { display: inline-flex; align-items: center; gap: 6px; color: var(--text-link); font-weight: 700; text-underline-offset: 4px; }
	@media (max-width: 767px) {
		.trust { border-radius: var(--radius-card); padding: 20px; }
		.trust ul { flex-direction: column; align-items: flex-start; }
		.trust .sep { display: none; }
	}

	/* Dashboard teaser */
	.teaser-head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
	}
	.teaser { padding: clamp(16px, 2.5vw, 28px); }

	/* Testimonials */
	.quotes { display: grid; gap: 16px; }
	@media (min-width: 900px) { .quotes { grid-template-columns: repeat(3, 1fr); } }
	.quote { padding: 28px; }
	.quote figure { display: flex; flex-direction: column; gap: 20px; height: 100%; }
	.quote blockquote { margin: 0; font-size: 1.0625rem; }
	.quote figcaption { margin-top: auto; color: var(--text-muted); }
	.quote strong { color: var(--text-on-glass); }

	.compare { text-align: center; margin-top: 24px; }
	.compare a { display: inline-flex; align-items: center; gap: 6px; color: var(--text-on-bg); font-weight: 700; text-underline-offset: 4px; }

	/* Download */
	.download { display: grid; gap: 32px; align-items: center; }
	.download h2 + .lede { margin-top: 16px; }
	.badges { margin-top: 28px; }
	@media (min-width: 1024px) {
		.download { grid-template-columns: 1fr auto; }
		.qr-card {
			display: flex;
			align-items: center;
			gap: 20px;
			max-width: 420px;
			padding: 20px;
		}
		.qr-card p { color: var(--text-muted); font-size: 0.9375rem; }
		.qr-card strong { color: var(--text-on-glass); }
	}
</style>
