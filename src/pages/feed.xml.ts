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
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
	);

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dhruv Verma - Blog</title>
    <link>${escapeXml(base)}/blog</link>
    <description>Articles and tutorials on Node.js, React, TypeScript, and building products. By Dhruv Verma.</description>
    <language>en</language>
    <atom:link href="${escapeXml(base)}/feed.xml" rel="self" type="application/rss+xml"/>
${posts
	.map(
		(post) => `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(base)}/blog/${escapeXml(post.slug)}</link>
      <description>${escapeXml(post.data.excerpt)}</description>
      <pubDate>${post.data.publishDate.toUTCString()}</pubDate>
      <guid isPermaLink="true">${escapeXml(base)}/blog/${escapeXml(post.slug)}</guid>
    </item>`,
	)
	.join('\n')}
  </channel>
</rss>`;

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
