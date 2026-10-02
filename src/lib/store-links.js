// Placeholder listings — Lumen is fictional. Swap in real store IDs at launch.
export const STORE_URLS = {
	ios: 'https://apps.apple.com/gb/app/lumen-budget/id0000000000',
	android: 'https://play.google.com/store/apps/details?id=app.lumen.budget'
};

/** 'ios' | 'android' | 'desktop' */
export function detectPlatform() {
	if (typeof navigator === 'undefined') return 'desktop';
	const ua = navigator.userAgent;
	if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
	// iPadOS 13+ reports itself as a Mac; touch support gives it away
	if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'ios';
	if (/Android/i.test(ua)) return 'android';
	return 'desktop';
}
