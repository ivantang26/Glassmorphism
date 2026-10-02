#!/usr/bin/env node
/**
 * FR-7 — build-time contrast safety check.
 *
 * Reads the design tokens from src/app.css and, for every section theme,
 * samples the backgrounds a panel can end up over:
 *   - the bare base colour,
 *   - each blob along its radial fall-off (centre → edge),
 *   - every pair of overlapping blobs.
 * Each glass surface is composited over every sample and each text token is
 * checked against the result. Any pair under 4.5:1 fails the build.
 *
 * Usage: node scripts/check-contrast.mjs [--verbose]
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const MIN_RATIO = 4.5;
const BLOBS = ['--violet', '--teal', '--coral', '--blue'];
const THEMES = ['.theme-light', '.theme-dark', '.theme-calm'];
const CONTEXTS = ['', '@media (prefers-contrast: more)'];
const BODY_TEXT = ['--text-on-glass', '--text-muted', '--text-positive', '--text-negative', '--text-link'];
const verbose = process.argv.includes('--verbose');

const cssPath = fileURLToPath(new URL('../src/app.css', import.meta.url));
const css = readFileSync(cssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

/* ---------- tiny CSS reader: custom properties per selector and at-rule ---------- */

function parse(source, context = '') {
	const rules = [];
	let i = 0;
	while (i < source.length) {
		const open = source.indexOf('{', i);
		if (open === -1) break;
		let depth = 1;
		let j = open + 1;
		while (depth && j < source.length) {
			if (source[j] === '{') depth++;
			else if (source[j] === '}') depth--;
			j++;
		}
		const prelude = source.slice(i, open).trim();
		const body = source.slice(open + 1, j - 1);
		if (prelude.startsWith('@')) {
			rules.push(...parse(body, prelude.replace(/\s+/g, ' ')));
		} else {
			const decls = {};
			for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) decls[name] = value.trim();
			rules.push({ context, selectors: prelude.split(',').map((s) => s.trim()), decls });
		}
		i = j;
	}
	return rules;
}

const rules = parse(css);
const declsFor = (selector, context) =>
	Object.assign({}, ...rules.filter((r) => r.context === context && r.selectors.includes(selector)).map((r) => r.decls));

function tokensFor(theme, context) {
	const tokens = { ...declsFor(':root', ''), ...declsFor(theme, '') };
	if (context) Object.assign(tokens, declsFor(':root', context), declsFor(theme, context));
	const resolve = (value, seen = new Set()) =>
		value.replace(/var\((--[\w-]+)\)/g, (_, name) => {
			if (seen.has(name) || !(name in tokens)) throw new Error(`Unresolvable ${name} in ${theme} ${context}`);
			return resolve(tokens[name], new Set([...seen, name]));
		});
	return (name) => {
		if (!(name in tokens)) throw new Error(`Missing token ${name} for ${theme} ${context || '(default)'}`);
		return parseColor(resolve(tokens[name]), name);
	};
}

/* ---------- colour maths (sRGB compositing, WCAG 2 luminance) ---------- */

function parseColor(value, name) {
	const v = value.trim();
	let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (m) {
		const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
		return [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16)).concat(1);
	}
	m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)$/i);
	if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
	throw new Error(`Cannot parse colour for ${name}: "${value}"`);
}

const over = (top, bottom, alpha = top[3]) => [0, 1, 2].map((k) => top[k] * alpha + bottom[k] * (1 - alpha)).concat(1);
const channel = (c) => {
	const s = c / 255;
	return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const contrast = (a, b) => {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
};
const hex = (c) => '#' + c.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase();

/* ---------- background sampling ---------- */

function blobAlpha(theme, context) {
	const pick = (sel, ctx) => declsFor(sel, ctx)['--blob-alpha'];
	const v = (context && pick(theme, context)) || pick(theme, '');
	if (v === undefined) throw new Error(`Missing --blob-alpha for ${theme}`);
	return parseFloat(v);
}

/* ---------- checks ---------- */

const results = [];

function check(scope, surfaceLabel, layers, textTokens, backgrounds, get) {
	for (const text of textTokens) {
		const fg = get(text);
		let worst = { ratio: Infinity };
		for (const bg of backgrounds) {
			const surface = layers.reduce((acc, layer) => over(layer, acc), bg.color);
			const ratio = contrast(fg, surface);
			if (ratio < worst.ratio) worst = { ratio, bg: bg.label, composite: surface };
		}
		results.push({ scope, surface: surfaceLabel, text, ...worst });
	}
}

const navBackgrounds = [];

for (const context of CONTEXTS) {
	for (const theme of THEMES) {
		const raw = tokensFor(theme, context);
		const peak = blobAlpha(theme, context);
		const get = (name) => raw(name);
		const backgrounds = sampleBackgroundsWith(get, peak);
		if (!context) navBackgrounds.push(...backgrounds.map((b) => ({ ...b, label: `${theme} ${b.label}` })));
		const scope = `${theme}${context ? ' ' + context : ''}`;

		check(scope, 'bare background', [], ['--text-on-bg', '--text-on-bg-muted'], backgrounds, get);
		check(scope, 'glass panel', [get('--glass-fill')], BODY_TEXT, backgrounds, get);
		check(scope, 'nested panel', [get('--glass-fill'), get('--glass-fill-nested')], BODY_TEXT, backgrounds, get);
		check(scope, 'no-blur fallback', [get('--glass-fallback')], BODY_TEXT, backgrounds, get);
		check(scope, 'no-blur nested', [get('--glass-fallback'), get('--glass-fallback')], BODY_TEXT, backgrounds, get);
	}
}

function sampleBackgroundsWith(get, peak) {
	const base = get('--base');
	const samples = [{ label: 'base', color: base }];
	for (const blob of BLOBS) {
		for (let s = 0.1; s <= 1.0001; s += 0.1) {
			samples.push({ label: `${blob} @${(peak * s).toFixed(2)}`, color: over(get(blob), base, peak * s) });
		}
	}
	for (const a of BLOBS) {
		for (const b of BLOBS) {
			if (a === b) continue;
			for (const sa of [0.5, 1]) {
				for (const sb of [0.5, 1]) {
					const under = over(get(a), base, peak * sa);
					samples.push({ label: `${b} over ${a}`, color: over(get(b), under, peak * sb) });
				}
			}
		}
	}
	return samples;
}

// The nav floats over every section, so it is checked against all of their backgrounds.
for (const context of CONTEXTS) {
	const get = tokensFor('.theme-light', context);
	const scope = `nav${context ? ' ' + context : ''}`;
	check(scope, 'nav (top)', [get('--nav-fill')], ['--nav-text'], navBackgrounds, get);
	check(scope, 'nav (scrolled)', [get('--nav-fill-scrolled')], ['--nav-text'], navBackgrounds, get);
	check(scope, 'nav (no-blur)', [get('--nav-fallback')], ['--nav-text'], navBackgrounds, get);
}

// Primary button: solid gradient, checked at both ends and the middle.
{
	const get = tokensFor('.theme-light', '');
	const from = get('--btn-from');
	const to = get('--btn-to');
	const stops = [
		{ label: 'gradient start', color: from },
		{ label: 'gradient middle', color: over(from, to, 0.5) },
		{ label: 'gradient end', color: to }
	];
	check('button', 'primary button', [], ['--btn-text'], stops, get);
}

/* ---------- report ---------- */

const failures = results.filter((r) => r.ratio < MIN_RATIO);
const pad = (s, n) => String(s).padEnd(n);

console.log(`\nLumen contrast check — ${results.length} text/surface pairs, minimum ${MIN_RATIO}:1\n`);
for (const r of results) {
	if (!verbose && r.ratio >= MIN_RATIO) continue;
	const mark = r.ratio >= MIN_RATIO ? 'pass' : 'FAIL';
	console.log(
		`  ${mark}  ${pad(r.ratio.toFixed(2) + ':1', 9)} ${pad(r.scope, 44)} ${pad(r.surface, 18)} ${pad(r.text, 20)} worst over ${r.bg} (${hex(r.composite)})`
	);
}

const tightest = [...results].sort((a, b) => a.ratio - b.ratio).slice(0, 5);
console.log('\n  Tightest pairs:');
for (const r of tightest) {
	console.log(`    ${pad(r.ratio.toFixed(2) + ':1', 9)} ${pad(r.scope, 44)} ${pad(r.surface, 18)} ${r.text}`);
}

if (failures.length) {
	console.error(`\n✗ ${failures.length} pair(s) below ${MIN_RATIO}:1 — fix the tokens in src/app.css before building.\n`);
	process.exit(1);
}
console.log(`\n✓ All ${results.length} pairs meet ${MIN_RATIO}:1 against their worst-case background.\n`);
