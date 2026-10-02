<script>
	import Icon from './Icon.svelte';

	const week = [38, 22, 54, 30, 46, 72, 26];
	const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
</script>

<div class="visual">
	<div class="phone" role="img" aria-label="The Lumen app home screen, showing £420 left to spend this month, a weekly spending chart and recent categories.">
		<div class="screen" aria-hidden="true">
			<div class="status"><span>9:41</span><span class="island"></span><span>●●●</span></div>
			<p class="hello">Good morning, Priya</p>

			<div class="card main">
				<p class="label">Left to spend</p>
				<p class="big">£420</p>
				<div class="meter"><span></span></div>
				<p class="label">£38 a day · 11 days to go</p>
			</div>

			<div class="card">
				<p class="label">This week</p>
				<div class="bars">
					{#each week as h, i (i)}
						<div class="bar-col">
							<span class="bar" class:today={i === 5} style:height="{h}px"></span>
							<span class="day">{days[i]}</span>
						</div>
					{/each}
				</div>
			</div>

			<ul class="rows">
				<li><span class="dot" style:background="#2EC4B6"></span>Groceries<span>£96</span></li>
				<li><span class="dot" style:background="#F5C451"></span>Transport<span>£48</span></li>
				<li><span class="dot" style:background="#FF8A65"></span>Eating out<span>£52</span></li>
			</ul>
		</div>
	</div>

	<div class="float glass f1">
		<span class="icon violet"><Icon name="sparkle" size={18} /></span>
		<div><p class="strong num">£420</p><p class="sub">left this month</p></div>
	</div>
	<div class="float glass f2">
		<span class="icon teal"><Icon name="check" size={18} /></span>
		<div><p class="strong">Rent paid <span aria-hidden="true">✓</span></p><p class="sub">£750 · 1 Sep</p></div>
	</div>
	<div class="float glass f3">
		<svg class="ring" viewBox="0 0 36 36" aria-hidden="true">
			<circle cx="18" cy="18" r="15" fill="none" stroke="rgba(20,18,58,0.12)" stroke-width="4" />
			<circle cx="18" cy="18" r="15" fill="none" stroke="#5B3DF5" stroke-width="4" stroke-linecap="round" stroke-dasharray="{0.68 * 94.25} 94.25" transform="rotate(-90 18 18)" />
		</svg>
		<div><p class="strong">Holiday fund <span class="num">68%</span></p><p class="sub">£680 of £1,000</p></div>
	</div>
</div>

<style>
	.visual {
		position: relative;
		display: grid;
		place-items: center;
		padding: 24px 0 8px;
	}

	.phone {
		position: relative;
		width: min(290px, 78vw);
		aspect-ratio: 290 / 590;
		padding: 12px;
		border-radius: 46px;
		background: linear-gradient(160deg, #2A2760, #0D0B26);
		box-shadow:
			0 40px 80px rgba(20, 18, 58, 0.35),
			inset 0 0 0 2px rgba(255, 255, 255, 0.12);
	}
	.screen {
		height: 100%;
		overflow: hidden;
		border-radius: 36px;
		padding: 14px 16px;
		background:
			radial-gradient(120% 60% at 0% 0%, rgba(124, 92, 255, 0.45), transparent 60%),
			radial-gradient(90% 50% at 100% 30%, rgba(46, 196, 182, 0.3), transparent 60%),
			#14123A;
		color: #FFFFFF;
		font-size: 12px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.status { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 11px; }
	.island { width: 70px; height: 20px; border-radius: 99px; background: #000; }
	.hello { font-weight: 600; font-size: 14px; margin-top: 4px; }
	.card {
		padding: 12px;
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.18);
	}
	.label { color: #E2E0FA; font-size: 11px; }
	.big { font-size: 34px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; margin: 2px 0 8px; }
	.meter { height: 6px; border-radius: 99px; background: rgba(255, 255, 255, 0.16); margin-bottom: 8px; }
	.meter span { display: block; width: 72%; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #A08BFF, #4FD8CB); }
	.bars { display: flex; justify-content: space-between; align-items: flex-end; height: 96px; margin-top: 8px; }
	.bar-col { display: grid; justify-items: center; gap: 4px; }
	.bar { width: 14px; border-radius: 6px; background: rgba(255, 255, 255, 0.28); }
	.bar.today { background: linear-gradient(180deg, #A08BFF, #4FD8CB); }
	.day { font-size: 10px; color: #E2E0FA; }
	.rows { list-style: none; padding: 0; display: grid; gap: 8px; }
	.rows li { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 12px; background: rgba(255, 255, 255, 0.06); }
	.rows li span:last-child { margin-left: auto; font-weight: 600; }
	.dot { width: 8px; height: 8px; border-radius: 3px; }

	/* Floating glass cards */
	.float {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 18px 14px 14px;
		border-radius: 20px;
		animation: bob 6s ease-in-out infinite;
		line-height: 1.3;
	}
	.strong { font-weight: 700; font-size: 1rem; }
	.sub { font-size: 0.8125rem; color: var(--text-muted); }
	.icon {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 12px;
		color: #FFFFFF;
	}
	.icon.violet { background: #5B3DF5; }
	.icon.teal { background: #0E7C74; }
	.ring { width: 40px; height: 40px; }

	.f1 { left: 0; top: 18%; animation-delay: 0s; }
	.f2 { right: 0; top: 46%; animation-delay: -2s; }
	.f3 { left: 4%; bottom: 6%; animation-delay: -4s; }

	/* Mobile: one card; tablet: two; desktop: three around the phone */
	.f2, .f3 { display: none; }
	.f1 { left: 50%; top: auto; bottom: 2%; translate: -50% 0; width: max-content; }

	@media (min-width: 640px) {
		.f2 { display: flex; }
		.f1 { left: 0; top: 6%; bottom: auto; translate: none; }
	}
	@media (min-width: 1024px) {
		.f3 { display: flex; }
		.f1 { left: -2%; }
		.f2 { right: -6%; }
	}

	@keyframes bob {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-4px); }
	}
</style>
