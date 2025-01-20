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
		author: z.object({
			name: z.string(),
			avatar: z.string(),
			bio: z.string(),
			social: z.object({
				twitter: z.string().optional(),
				linkedin: z.string().optional(),
				github: z.string().optional(),
			}),
		}),
		image: z.string(),
		featured: z.boolean().default(false),
		readingTime: z.number(),
		tags: z.array(z.string()),
		// Add these new fields
		series: z.string().optional(),
		seriesPart: z.number().optional(),
	}),
});

export const collections = {
	projects,
	blog,
};
