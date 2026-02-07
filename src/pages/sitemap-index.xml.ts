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

	const urls: string[] = [
		'/',
		'/blog',
		'/contact',
		'/experience',
		'/projects',
		'/activities',
		'/activities/events',
		'/activities/hackathons',
		'/activities/speaking',
		'/activities/awards',
		'/activities/travel',
	].map((path) => (path === '/' ? `${base}/` : `${base}${path}`));

	for (const post of blog) {
		urls.push(`${base}/blog/${post.slug}`);
	}

	const postsPerPage = 12;
	const totalBlogPages = Math.max(1, Math.ceil(blog.length / postsPerPage));
	for (let i = 1; i <= totalBlogPages; i++) {
		urls.push(`${base}/blog/page/${i}`);
	}

	const tagSet = new Set<string>();
	for (const post of blog) {
		(post.data.tags ?? []).forEach((tag: string) => tagSet.add(slugify(tag)));
	}
	for (const tag of tagSet) {
		urls.push(`${base}/blog/tag/${tag}`);
	}

	for (const project of projects) {
		urls.push(`${base}/projects/${project.slug}`);
	}

	for (const activity of activities) {
		urls.push(`${base}/activities/${activity.slug}`);
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
}
