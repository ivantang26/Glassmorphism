<script>
	import Logo from './Logo.svelte';
</script>

<footer class="footer theme-dark">
	<div class="container grid">
		<div class="about">
			<a class="brand" href="/"><Logo /><span>Lumen</span></a>
			<p>See your money clearly.</p>
		</div>
		<nav aria-label="Footer">
			<ul role="list">
				<li><a href="/dashboard">Live demo</a></li>
				<li><a href="/security">Security</a></li>
				<li><a href="/pricing">Pricing</a></li>
				<li><a href="/download">Download</a></li>
				<li><a href="/privacy">Privacy</a></li>
			</ul>
		</nav>
	</div>
	<div class="container small">
		<p>
			Lumen is a fictional product, built as a design study in accessible glassmorphism. The dashboard uses sample
			data only and nothing on this site connects to a bank.
		</p>
		<p>© 2026 Lumen</p>
	</div>
</footer>

<style>
	.footer {
		background: var(--base);
		color: var(--text-on-bg);
		padding-block: 56px 40px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
	.grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 32px;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-weight: 700;
		font-size: 1.25rem;
		text-decoration: none;
	}
	.about p { margin-top: 8px; color: var(--text-on-bg-muted); }
	ul { display: flex; flex-wrap: wrap; gap: 8px 28px; }
	ul a { font-weight: 600; text-decoration: none; }
	ul a:hover { text-decoration: underline; text-underline-offset: 4px; }
	.small {
		margin-top: 40px;
		padding-top: 24px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px 32px;
		font-size: var(--fs-small);
		color: var(--text-on-bg-muted);
	}
	.small p:first-child { max-width: 44rem; }
</style>
