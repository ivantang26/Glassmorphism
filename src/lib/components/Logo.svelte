<script>
	let { size = 28 } = $props();
	const id = $props.id();
</script>

<svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
	<defs>
		<linearGradient id="{id}-g" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#7C5CFF" />
			<stop offset="1" stop-color="#2EC4B6" />
		</linearGradient>
	</defs>
	<circle cx="16" cy="16" r="15" fill="url(#{id}-g)" />
	<circle cx="16" cy="16" r="9" fill="#fff" fill-opacity="0.35" />
	<circle cx="16" cy="16" r="4.5" fill="#fff" />
</svg>
