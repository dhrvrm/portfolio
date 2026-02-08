import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		tech: z.array(z.string()),
		image: z.string(),
		category: z.enum(['client', 'personal']),
		featured: z.boolean().default(false),
		publishDate: z.date(),
		client: z.string().optional(),
		role: z.string(),
		duration: z.string(),
		challenge: z.string(),
		solution: z.string(),
		impact: z.string(),
		website: z.string().url().optional(),
		repository: z.string().url().optional(),
	}),
});

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		publishDate: z.date(),
		categories: z.array(z.string()),
		excerpt: z.string(),
		image: z.string(),
		featured: z.boolean().default(false),
		readingTime: z.number(),
		tags: z.array(z.string()),
		series: z.string().optional(),
		seriesPart: z.number().optional(),
		// SEO: HowTo rich results (optional). Steps must match visible H2s in the post.
		howTo: z
			.object({
				name: z.string(),
				steps: z.array(
					z.object({
						name: z.string(),
						text: z.string(),
					}),
				),
			})
			.optional(),
		// SEO: FAQ rich results (optional). Render an FAQ section so content matches schema.
		faqs: z
			.array(
				z.object({
					question: z.string(),
					answer: z.string(),
				}),
			)
			.optional(),
	}),
});

const activities = defineCollection({
	schema: z.object({
		title: z.string(),
		category: z.enum(['events', 'hackathons', 'speaking', 'awards', 'travel']),
		role: z.string(),
		date: z.coerce.date(),
		location: z.string(),
		summary: z.string(),
		featured: z.boolean().default(false),
		// Events: how was the event narrative
		narrative: z.string().optional(),
		// Hackathons: participated | mentored | judged
		hackathonType: z.enum(['participated', 'mentored', 'judged']).optional(),
		// Optional media gallery for cards/galleries
		images: z.array(z.string()).optional(),
		// Optional video (mp4/webm/url) for featured media
		video: z.string().optional(),
	}),
});

const experience = defineCollection({
	schema: z.object({
		title: z.string(),
		company: z.string(),
		startDate: z.coerce.date(),
		endDate: z.coerce.date().optional(),
		order: z.number(),
		achievements: z.array(z.string()),
	}),
});

export const collections = {
	projects,
	blog,
	activities,
	experience,
};
