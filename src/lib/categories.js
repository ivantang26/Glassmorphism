/*
 * Chart colours are tints of the brand field, lightened so segments keep
 * 3:1 against dark glass. Each category also has a pattern for
 * high-contrast mode, and every chart is labelled in text.
 */
export const CATEGORIES = {
	rent: { color: '#A08BFF', pattern: 'diagonal' },
	bills: { color: '#5AA9FF', pattern: 'dots' },
	groceries: { color: '#2EC4B6', pattern: 'cross' },
	transport: { color: '#F5C451', pattern: 'horizontal' },
	eating: { color: '#FF8A65', pattern: 'vertical' },
	fun: { color: '#F28DC5', pattern: 'grid' },
	tools: { color: '#9BE36D', pattern: 'zigzag' },
	income: { color: '#86EBC2', pattern: 'none' }
};

export const LABELS = {
	rent: 'Rent',
	bills: 'Bills',
	groceries: 'Groceries',
	transport: 'Transport',
	eating: 'Eating out',
	fun: 'Fun & shopping',
	tools: 'Work tools',
	income: 'Income'
};

export const categoryColor = (id) => CATEGORIES[id]?.color ?? '#C9C6EE';
