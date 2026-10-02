import graduate from './graduate.json';
import couple from './couple.json';
import freelancer from './freelancer.json';

/** Sample personas for the dashboard preview (FR-1). Bundled, so switching is instant. */
export const PERSONAS = [graduate, couple, freelancer];

export const getPersona = (id) => PERSONAS.find((p) => p.id === id) ?? graduate;

/** Date of the i-th entry in a 30-day series that ends on `asOf`. */
export function seriesDate(asOf, i, length = 30) {
	const d = new Date(asOf + 'T12:00:00');
	d.setDate(d.getDate() - (length - 1 - i));
	return d.toISOString().slice(0, 10);
}
