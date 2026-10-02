<script>
	import { qrModal } from '$lib/app-modal.svelte.js';
	import QrCode from './QrCode.svelte';
	import StoreBadges from './StoreBadges.svelte';
	import Icon from './Icon.svelte';

	let dialog;

	$effect(() => {
		if (qrModal.open && !dialog.open) dialog.showModal();
		if (!qrModal.open && dialog.open) dialog.close();
	});
</script>

<dialog
	bind:this={dialog}
	class="qr-dialog glass theme-light"
	aria-labelledby="qr-title"
	onclose={() => (qrModal.open = false)}
	onclick={(e) => e.target === dialog && dialog.close()}
>
	<div class="inner">
		<button class="close" onclick={() => dialog.close()} aria-label="Close">
			<Icon name="close" size={22} />
		</button>
		{#if qrModal.open}
			<QrCode size={184} />
		{/if}
		<div class="copy">
			<h2 id="qr-title">Scan to get Lumen</h2>
			<p>Point your phone's camera at the code. It opens the right store for your phone.</p>
			<p class="or">Or go to the store directly:</p>
			<StoreBadges source="qr-modal" />
		</div>
	</div>
</dialog>

<style>
	.qr-dialog {
		--glass-fill: rgba(255, 255, 255, 0.88);
		width: min(640px, calc(100vw - 32px));
		max-height: calc(100dvh - 32px);
		padding: 0;
		margin: auto;
		overflow: auto;
	}
	.qr-dialog::backdrop {
		background: rgba(20, 18, 58, 0.45);
		-webkit-backdrop-filter: blur(4px);
		backdrop-filter: blur(4px);
	}
	.inner {
		display: flex;
		gap: 28px;
		align-items: center;
		padding: 32px;
	}
	h2 { font-size: 1.5rem; margin-bottom: 8px; }
	p { color: var(--text-muted); }
	.or { margin: 16px 0 10px; font-size: var(--fs-small); font-weight: 600; }
	.close {
		position: absolute;
		top: 12px;
		right: 12px;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
	}
	.close:hover { background: rgba(20, 18, 58, 0.08); }
	@media (max-width: 599px) {
		.inner { flex-direction: column; text-align: center; padding: 48px 20px 28px; }
		.copy :global(.badges) { justify-content: center; }
	}
</style>
