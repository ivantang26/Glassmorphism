<script>
	import { PERSONAS } from '$lib/data/personas.js';

	let { value = $bindable(), name = 'persona' } = $props();
</script>

<fieldset class="switch">
	<legend class="sr-only">Sample persona</legend>
	{#each PERSONAS as p (p.id)}
		<label class:active={value === p.id}>
			<input type="radio" {name} value={p.id} bind:group={value} />
			<span>{p.label}</span>
		</label>
	{/each}
</fieldset>

<style>
	.switch {
		display: inline-flex;
		gap: 4px;
		margin: 0;
		padding: 4px;
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-pill);
		background: var(--glass-fill);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		color: var(--text-on-glass);
	}
	:global(.glass) .switch {
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
		background: var(--glass-fill-nested);
	}
	label {
		position: relative;
		display: block;
		cursor: pointer;
	}
	input {
		position: absolute;
		inset: 0;
		opacity: 0;
		margin: 0;
		cursor: pointer;
	}
	span {
		display: block;
		padding: 8px 18px;
		border-radius: var(--radius-pill);
		font-weight: 600;
		font-size: 0.9375rem;
		transition: background-color 200ms ease, color 200ms ease;
	}
	label:hover span { background: rgba(255, 255, 255, 0.08); }
	.active span {
		background: #FFFFFF;
		color: #14123A;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
	}
	input:focus-visible + span {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}
	@media (max-width: 420px) {
		.switch { display: flex; }
		label { flex: 1; text-align: center; }
		span { padding-inline: 8px; }
	}
	@media (prefers-contrast: more) {
		.active span { outline: 2px solid currentColor; }
	}
	:global(.no-blur) .switch { background: var(--glass-fallback); }
</style>
