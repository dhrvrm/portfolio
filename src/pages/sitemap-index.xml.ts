import { getCollection } from 'astro:content';

const SITE = import.meta.env.SITE ?? 'https://dhruvverma.dev';

function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

interface UrlEntry {
	loc: string;
	lastmod?: string;
}

function toLastmod(d: Date): string {
	return d.toISOString().slice(0, 10);
}

export async function GET() {
	const base = SITE.replace(/\/$/, '');
	const [blog, projects, activities] = await Promise.all([
		getCollection('blog'),
		getCollection('projects'),
		getCollection('activities'),
	]);

	const slugify = (v: string) =>
		v
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');

	const entries: UrlEntry[] = [
		{ loc: `${base}/` },
		{ loc: `${base}/blog` },
		{ loc: `${base}/contact` },
		{ loc: `${base}/experience` },
		{ loc: `${base}/projects` },
		{ loc: `${base}/activities` },
		{ loc: `${base}/activities/events` },
		{ loc: `${base}/activities/hackathons` },
		{ loc: `${base}/activities/speaking` },
		{ loc: `${base}/activities/awards` },
		{ loc: `${base}/activities/travel` },
	];

	for (const post of blog) {
		entries.push({
			loc: `${base}/blog/${post.slug}`,
			lastmod: toLastmod(post.data.publishDate),
		});
	}

	const postsPerPage = 12;
	const totalBlogPages = Math.max(1, Math.ceil(blog.length / postsPerPage));
	for (let i = 2; i <= totalBlogPages; i++) {
		entries.push({ loc: `${base}/blog/page/${i}` });
	}

	const tagSet = new Set<string>();
	for (const post of blog) {
		(post.data.tags ?? []).forEach((tag: string) => tagSet.add(slugify(tag)));
	}
	for (const tag of tagSet) {
		entries.push({ loc: `${base}/blog/tag/${tag}` });
	}

	for (const project of projects) {
		entries.push({
			loc: `${base}/projects/${project.slug}`,
			lastmod: toLastmod(project.data.publishDate),
		});
	}

	for (const activity of activities) {
		entries.push({
			loc: `${base}/activities/${activity.slug}`,
			lastmod: toLastmod(activity.data.date),
		});
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) =>
			`  <url><loc>${escapeXml(e.loc)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`,
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
}
