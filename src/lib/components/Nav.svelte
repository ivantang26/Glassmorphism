<script>
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import Logo from './Logo.svelte';
	import Icon from './Icon.svelte';
	import GetAppButton from './GetAppButton.svelte';

	const links = [
		{ href: '/dashboard', label: 'Live demo' },
		{ href: '/security', label: 'Security' },
		{ href: '/pricing', label: 'Pricing' },
		{ href: '/download', label: 'Download' }
	];

	let scrollY = $state(0);
	// FR-4: glass thickens after 80px so links stay readable over busy content
	const scrolled = $derived(scrollY > 80);

	let sheet;
	afterNavigate(() => sheet?.open && sheet.close());

	const current = (href) => (page.url.pathname === href ? 'page' : undefined);
</script>

<svelte:window bind:scrollY />

<header class="site-nav" class:scrolled>
	<nav class="container bar" aria-label="Main">
		<a class="brand" href="/" aria-label="Lumen home">
			<Logo />
			<span>Lumen</span>
		</a>

		<ul class="links" role="list">
			{#each links as link (link.href)}
				<li><a href={link.href} aria-current={current(link.href)}>{link.label}</a></li>
			{/each}
		</ul>

		<div class="actions">
			<GetAppButton source="nav" small />
			<button class="menu-btn" aria-haspopup="dialog" aria-controls="menu-sheet" onclick={() => sheet.showModal()}>
				<Icon name="menu" size={22} />
				<span class="sr-only">Open menu</span>
			</button>
		</div>
	</nav>
</header>

<dialog id="menu-sheet" class="sheet theme-light" bind:this={sheet} aria-label="Menu">
	<div class="sheet-head">
		<a class="brand" href="/"><Logo /><span>Lumen</span></a>
		<button class="menu-btn" onclick={() => sheet.close()}>
			<Icon name="close" size={22} />
			<span class="sr-only">Close menu</span>
		</button>
	</div>
	<ul class="sheet-links" role="list">
		<li><a href="/" aria-current={current('/')}>Home</a></li>
		{#each links as link (link.href)}
			<li><a href={link.href} aria-current={current(link.href)}>{link.label}</a></li>
		{/each}
		<li><a href="/privacy" aria-current={current('/privacy')}>Privacy</a></li>
	</ul>
	<div class="sheet-cta"><GetAppButton source="menu" /></div>
</dialog>

<style>
	.site-nav {
		position: sticky;
		top: 0;
		z-index: 50;
		height: var(--nav-height);
		margin-bottom: calc(var(--nav-height) * -1);
		background: var(--nav-fill);
		border-bottom: 1px solid rgba(255, 255, 255, 0.6);
		box-shadow: 0 4px 24px rgba(20, 18, 58, 0.08);
		-webkit-backdrop-filter: blur(var(--nav-blur));
		backdrop-filter: blur(var(--nav-blur));
		color: var(--nav-text);
		transition: background-color 200ms ease;
		--focus: #4325C9;
	}
	.site-nav.scrolled { background: var(--nav-fill-scrolled); }

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		height: 100%;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-weight: 700;
		font-size: 1.25rem;
		letter-spacing: -0.02em;
		text-decoration: none;
	}
	.links {
		display: none;
		gap: 4px;
		margin-right: auto;
		margin-left: 24px;
	}
	.links a {
		display: block;
		padding: 8px 14px;
		border-radius: var(--radius-pill);
		font-weight: 600;
		font-size: 0.9375rem;
		text-decoration: none;
	}
	.links a:hover { background: rgba(20, 18, 58, 0.07); }
	.links a[aria-current='page'] { background: rgba(20, 18, 58, 0.1); }

	.actions { display: flex; align-items: center; gap: 8px; }
	.menu-btn {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 1px solid rgba(20, 18, 58, 0.14);
		background: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		color: #14123A;
	}

	@media (min-width: 900px) {
		.links { display: flex; }
		.bar .menu-btn { display: none; }
	}
	@media (max-width: 380px) {
		.actions :global(.btn) { padding-inline: 14px; }
	}

	/* Full-height glass sheet */
	.sheet {
		width: 100%;
		max-width: none;
		height: 100dvh;
		max-height: none;
		margin: 0;
		padding: 0 var(--gutter) 32px;
		border: 0;
		background: rgba(255, 255, 255, 0.8);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		color: #14123A;
	}
	.sheet::backdrop { background: transparent; }
	.sheet[open] { display: flex; flex-direction: column; animation: sheet-in 260ms var(--ease-out); }
	.sheet-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: var(--nav-height);
	}
	.sheet-links { margin-top: 24px; display: grid; gap: 4px; }
	.sheet-links a {
		display: block;
		padding: 14px 4px;
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-decoration: none;
		border-bottom: 1px solid rgba(20, 18, 58, 0.1);
	}
	.sheet-links a[aria-current='page'] { color: #4325C9; }
	.sheet-cta { margin-top: auto; padding-top: 24px; }
	.sheet-cta :global(.btn) { width: 100%; }

	:global(:root:has(dialog[open])) { overflow: hidden; }

	@media (prefers-contrast: more) {
		.sheet { background: #FFFFFF; }
	}
	@keyframes sheet-in {
		from { opacity: 0; transform: translateY(-12px); }
	}
</style>
