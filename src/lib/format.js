const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const gbpWhole = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

/** £1,234.56 — or £1,235 with `whole` */
export function money(value, { whole = false } = {}) {
	return (whole ? gbpWhole : gbp).format(value);
}

/** +£12.00 / −£12.00, with a real minus sign so screen readers say "minus" */
export function signedMoney(value) {
	return (value < 0 ? '−' : '+') + gbp.format(Math.abs(value));
}

export function percent(value) {
	return `${Math.round(value * 100)}%`;
}

const dayFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
export function shortDate(iso) {
	return dayFormat.format(new Date(iso + 'T12:00:00'));
}
