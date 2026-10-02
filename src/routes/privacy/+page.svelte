<script>
	import Band from '$lib/components/Band.svelte';
</script>

<svelte:head>
	<title>Privacy — Lumen</title>
	<meta name="description" content="What Lumen collects, why, and how to get it deleted." />
</svelte:head>

<Band theme="calm" preset="calm" blobs={2}>
	<section class="container page" aria-labelledby="page-title">
		<header class="section-head">
			<p class="eyebrow">Privacy</p>
			<h1 id="page-title">Privacy notice</h1>
			<p class="lede">The short, readable version of what we collect and why.</p>
		</header>

		<article class="glass doc">
			<h2>This website</h2>
			<p>
				This site doesn't use advertising cookies. We count which pages are visited and which download buttons are pressed so we can tell whether the site is useful. Those counts are anonymous and aren't linked to you.
			</p>
			<p>The live dashboard runs entirely in your browser using sample data. Nothing you do there is sent to us.</p>

			<h2>The Lumen app</h2>
			<ul>
				<li><strong>What we collect:</strong> your email address, the accounts you choose to connect, and their balances and transactions.</li>
				<li><strong>Why:</strong> to show your budgets, insights and goals. Nothing else.</li>
				<li><strong>Who we share it with:</strong> our open banking partner, to fetch your transactions, and our hosting provider, which stores the data encrypted in the UK. We never sell your data.</li>
				<li><strong>How long we keep it:</strong> until you delete your account. After that it's erased within 30 days, and removed from backups within a further 35 days.</li>
			</ul>

			<h2>Your rights</h2>
			<p>
				You can ask for a copy of your data, correct it or have it deleted at any time from Settings → Privacy in the app. If you're unhappy with how we handle your data, you can complain to the Information Commissioner's Office.
			</p>

			<p class="note">Lumen is a fictional product made as a design study. This notice is illustrative.</p>
		</article>
	</section>
</Band>

<style>
	.page {
		padding-top: calc(var(--nav-height) + clamp(40px, 6vw, 80px));
		padding-bottom: clamp(56px, 8vw, 112px);
	}
	.doc {
		max-width: 46rem;
		padding: clamp(24px, 4vw, 48px);
		display: grid;
		gap: 16px;
	}
	.doc h2 { font-size: var(--fs-h3); margin-top: 12px; }
	.doc h2:first-child { margin-top: 0; }
	.doc ul { display: grid; gap: 10px; padding-left: 1.2em; }
	.note { font-size: var(--fs-small); color: var(--text-muted); border-top: 1px solid rgba(20, 18, 58, 0.12); padding-top: 16px; }
</style>
