<script>
	import Band from '$lib/components/Band.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import GetAppButton from '$lib/components/GetAppButton.svelte';

	const topics = [
		{
			icon: 'lock',
			title: 'Encryption',
			body: [
				'Everything you send to Lumen travels over TLS 1.3, the same protection your bank uses for online banking.',
				'Stored data is encrypted with 256-bit AES. Encryption keys are kept in a separate key-management service and rotated regularly.'
			]
		},
		{
			icon: 'eye',
			title: 'Read-only access',
			body: [
				'Lumen can see balances and transactions. It cannot move money, make payments or change anything in your bank account.',
				'You give permission through your own bank’s app or website. Lumen never sees or stores your banking password.'
			]
		},
		{
			icon: 'bank',
			title: 'Our open banking partner',
			body: [
				'Bank connections run through an open banking partner authorised by the Financial Conduct Authority as an account information service provider.',
				'You confirm access every 90 days, and you can withdraw it at any time from Lumen or from your bank.'
			]
		},
		{
			icon: 'server',
			title: 'Where your data lives',
			body: [
				'Your data is stored in UK data centres. It is not sold, and it is never shared with advertisers.',
				'Only a small number of staff can access production systems, and every access is logged and reviewed.'
			]
		},
		{
			icon: 'trash',
			title: 'Deleting your data',
			body: [
				'Delete your account in Settings and your bank connections are cut immediately.',
				'Your data is erased from live systems within 30 days and drops out of encrypted backups within a further 35 days.'
			]
		},
		{
			icon: 'key',
			title: 'Protecting your account',
			body: [
				'The app locks with Face ID, fingerprint or a passcode. New devices need a one-time code before they can sign in.',
				'Found a security issue? Email security@lumen.example and we will reply within two working days.'
			]
		}
	];
</script>

<svelte:head>
	<title>Security — Lumen</title>
	<meta name="description" content="How Lumen protects your money and data: read-only bank connections, 256-bit encryption, UK data storage and full deletion on request." />
</svelte:head>

<Band theme="calm" preset="calm" blobs={2}>
	<section class="container page" aria-labelledby="page-title">
		<header class="section-head">
			<p class="eyebrow">Security</p>
			<h1 id="page-title">Your money stays where it is</h1>
			<p class="lede">Lumen can look but never touch. Here's how bank connections, encryption and your data work, in plain English.</p>
		</header>

		<div class="glass summary">
			<h2>The short version</h2>
			<ul role="list">
				<li><Icon name="check" /><span>Lumen <strong>cannot move money</strong>. Bank access is read-only.</span></li>
				<li><Icon name="check" /><span>We <strong>never see your bank password</strong>.</span></li>
				<li><Icon name="check" /><span>Your data is <strong>encrypted</strong> and <strong>never sold</strong>.</span></li>
				<li><Icon name="check" /><span>Delete your account and <strong>your data goes with it</strong>.</span></li>
			</ul>
		</div>

		<ul class="topics" role="list">
			{#each topics as t (t.title)}
				<li class="glass topic">
					<span class="icon"><Icon name={t.icon} size={22} /></span>
					<h2>{t.title}</h2>
					{#each t.body as para, i (i)}<p>{para}</p>{/each}
				</li>
			{/each}
		</ul>

		<div class="glass outro">
			<p>Questions about security? Read our <a href="/privacy">privacy notice</a>, or get the app and look for Help → Security.</p>
			<GetAppButton source="security" />
		</div>
	</section>
</Band>

<style>
	.page {
		padding-top: calc(var(--nav-height) + clamp(40px, 6vw, 80px));
		padding-bottom: clamp(56px, 8vw, 112px);
		display: grid;
		gap: 20px;
	}
	h1 { max-width: 16ch; }

	.summary { padding: clamp(24px, 3vw, 36px); }
	.summary h2 { font-size: var(--fs-h3); margin-bottom: 16px; }
	.summary ul { display: grid; gap: 12px; }
	@media (min-width: 720px) { .summary ul { grid-template-columns: 1fr 1fr; } }
	.summary li { display: flex; gap: 10px; align-items: flex-start; }
	.summary li :global(svg) { flex: none; margin-top: 4px; color: var(--text-positive); }

	.topics { display: grid; gap: 16px; }
	@media (min-width: 720px) { .topics { grid-template-columns: 1fr 1fr; } }
	@media (min-width: 1080px) { .topics { grid-template-columns: repeat(3, 1fr); } }
	.topic { display: grid; align-content: start; gap: 12px; padding: 28px; }
	.topic h2 { font-size: var(--fs-h3); }
	.topic p { color: var(--text-muted); }
	.icon {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: #14123A;
		color: #FFFFFF;
	}

	.outro {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px 24px;
		padding: 24px 28px;
	}
	.outro a { color: var(--text-link); font-weight: 600; }
</style>
