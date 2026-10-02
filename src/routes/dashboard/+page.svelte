<script>
	import Band from '$lib/components/Band.svelte';
	import Dashboard from '$lib/dashboard/Dashboard.svelte';
	import GetAppButton from '$lib/components/GetAppButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
</script>

<svelte:head>
	<title>Live demo — Lumen</title>
	<meta name="description" content="Try the Lumen dashboard in your browser with sample data. Switch personas and adjust budgets to see what's left to spend." />
</svelte:head>

<Band theme="dark" preset="wide">
	<section class="container page" aria-labelledby="page-title">
		<header class="head">
			<div>
				<p class="eyebrow">Live preview</p>
				<h1 id="page-title">Your month, at a glance</h1>
			</div>
			<GetAppButton source="dashboard-head" />
		</header>

		<p class="glass banner" role="note">
			<Icon name="info" />
			<span><strong>This is sample data.</strong> Nothing here is connected to a bank. The people and figures are made up to show how Lumen works.</span>
		</p>

		<Dashboard />

		<div class="glass outro">
			<div>
				<h2>Like what you see?</h2>
				<p>Connect your own accounts in the app and Lumen builds this view for you.</p>
			</div>
			<GetAppButton source="dashboard-foot" />
		</div>
	</section>
</Band>

<style>
	.page {
		display: grid;
		gap: 24px;
		padding-top: calc(var(--nav-height) + clamp(32px, 5vw, 64px));
		padding-bottom: clamp(56px, 8vw, 112px);
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px 24px;
	}
	h1 { font-size: var(--fs-h2); }
	.banner {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 14px 20px;
		border-radius: var(--radius-inner);
	}
	.banner :global(svg) { flex: none; margin-top: 3px; }
	.outro {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px 24px;
		margin-top: 16px;
		padding: clamp(24px, 3vw, 36px);
	}
	.outro h2 { font-size: var(--fs-h3); }
	.outro p { margin-top: 6px; color: var(--text-muted); }
</style>
