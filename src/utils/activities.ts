import { getCollection, type CollectionEntry } from 'astro:content';
import { featuredThenNewest } from './content';

export type Activity = CollectionEntry<'activities'>;

/** Canonical category list + labels. Single source for nav and routing. */
export const ACTIVITY_CATEGORIES = [
	{ slug: 'events', label: 'Events' },
	{ slug: 'hackathons', label: 'Hackathons' },
	{ slug: 'speaking', label: 'Speaking' },
	{ slug: 'awards', label: 'Recognition' },
	{ slug: 'travel', label: 'Travel' },
] as const;

export const categoryLabel = (slug: string): string =>
	ACTIVITY_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

/** Featured first, then newest first. */
export const byFeaturedThenDate = featuredThenNewest<Activity>(
	(i) => i.data.featured,
	(i) => i.data.date,
);

/** All activities, resolved once and pre-sorted. */
export const getActivities = async (): Promise<Activity[]> =>
	(await getCollection('activities')).sort(byFeaturedThenDate);

export const inCategory = (all: Activity[], category: string): Activity[] =>
	all.filter((i) => i.data.category === category);

export const categoryCounts = (all: Activity[]): Record<string, number> =>
	all.reduce(
		(acc, i) => {
			acc[i.data.category] = (acc[i.data.category] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);
