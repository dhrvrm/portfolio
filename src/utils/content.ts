// Shared content helpers used across pages and feeds.

/** URL-safe slug from arbitrary text (lowercase, hyphenated, alnum only). */
export const slugify = (value: string): string =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

/**
 * Comparator: featured items first, then newest first.
 * Works for any collection by supplying accessors.
 */
export const featuredThenNewest =
	<T>(getFeatured: (x: T) => boolean, getDate: (x: T) => Date) =>
	(a: T, b: T): number => {
		const fa = getFeatured(a);
		const fb = getFeatured(b);
		if (fa !== fb) return Number(fb) - Number(fa);
		return getDate(b).getTime() - getDate(a).getTime();
	};

/** Group items by calendar year (descending), via a date accessor. */
export const groupByYear = <T>(
	list: T[],
	getDate: (item: T) => Date,
): [string, T[]][] => {
	const groups = list.reduce(
		(acc, item) => {
			const year = String(getDate(item).getFullYear());
			(acc[year] ??= []).push(item);
			return acc;
		},
		{} as Record<string, T[]>,
	);
	return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
};
