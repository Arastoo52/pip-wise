import { Router } from 'express';
import { Broker } from '../models/broker.model.js';

const router = Router();
const SITE_URL = 'https://tradesafebrokers.com';

/**
 * @desc    Dynamic robots.txt for search engine crawlers
 * @route   GET /robots.txt
 */
router.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');

  const robotsTxt = [
    '# PipWise by TradeSafe Brokers — Search Engine Robots Policy',
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /api/',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ].join('\n');

  return res.status(200).send(robotsTxt);
});

/**
 * @desc    Dynamic XML Sitemap including static routes and approved brokers from MongoDB
 * @route   GET /sitemap.xml
 */
router.get('/sitemap.xml', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const today = new Date().toISOString().split('T')[0];

    const staticRoutes = [
      { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
      { loc: `${SITE_URL}/brokers`, changefreq: 'daily', priority: '0.95' },
      { loc: `${SITE_URL}/compare`, changefreq: 'daily', priority: '0.90' },
      { loc: `${SITE_URL}/join-broker`, changefreq: 'weekly', priority: '0.80' },
      { loc: `${SITE_URL}/privacy-policy`, changefreq: 'monthly', priority: '0.50' },
    ];

    let brokerUrls = [];
    try {
      const brokers = await Broker.find({ status: 'approved' })
        .select('name slug updatedAt')
        .lean()
        .limit(500);

      brokerUrls = brokers.map((b) => {
        const slug =
          b.slug ||
          encodeURIComponent(String(b.name || '').toLowerCase().replace(/\s+/g, '-'));
        const lastmod = b.updatedAt
          ? new Date(b.updatedAt).toISOString().split('T')[0]
          : today;
        return {
          loc: `${SITE_URL}/brokers?broker=${slug}`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.85',
        };
      });
    } catch {
      // Fallback if DB is not connected or Broker query fails
      brokerUrls = [];
    }

    const allUrls = [
      ...staticRoutes.map((r) => ({ ...r, lastmod: today })),
      ...brokerUrls,
    ];

    const xmlEntries = allUrls
      .map(
        (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

    return res.status(200).send(xml);
  } catch (err) {
    return res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
});

export default router;
