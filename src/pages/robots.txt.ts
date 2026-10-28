import type { APIRoute } from 'astro';

// Tells search engines they may crawl everything except the style guide, and where the sitemap is.
export const GET: APIRoute = ({ site }) =>
  new Response(
    ['User-agent: *', 'Allow: /', 'Disallow: /styleguide/', '', `Sitemap: ${new URL('sitemap-index.xml', site).href}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
