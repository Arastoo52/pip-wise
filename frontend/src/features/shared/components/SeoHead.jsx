import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://tradesafebrokers.com';
const DEFAULT_IMAGE = `${SITE_URL}/image.png`;
const SITE_NAME = 'PipWise by TradeSafe Brokers';

const ROUTE_SEO_CONFIG = {
  '/': {
    title: 'PipWise by TradeSafe Brokers — #1 Verified Forex Broker Reviews, Spreads & Comparison',
    description:
      'Compare top regulated Forex & CFD brokers side-by-side. Verify Tier-1 regulation (FCA, ASIC, CySEC), live raw spreads, execution speeds, swap rates, and real OTP-verified trader reviews on PipWise.',
    keywords:
      'forex broker reviews, best forex brokers 2026, compare forex brokers, regulated forex brokers, raw spread forex brokers, ECN brokers comparison, FCA ASIC CySEC forex brokers, TradeSafe Brokers, PipWise',
    breadcrumbName: 'Home',
    pageType: 'WebPage',
  },
  '/brokers': {
    title: 'All Verified Forex & CFD Brokers Directory (2026) | PipWise by TradeSafe Brokers',
    description:
      'Browse our audited directory of Tier-1 regulated Forex & CFD brokers. Filter by FCA, ASIC, CySEC regulation, ECN raw spreads, minimum deposit, leverage, and verified trader trust scores.',
    keywords:
      'forex brokers directory, all regulated forex brokers, top forex brokers list 2026, ECN forex brokers, low spread brokers, verified forex reviews, PipWise brokers',
    breadcrumbName: 'All Brokers Directory',
    pageType: 'CollectionPage',
  },
  '/compare': {
    title: 'Compare Forex Brokers Side-by-Side — Live Spreads, Fees & Regulation | PipWise',
    description:
      'Use the PipWise side-by-side Forex broker comparison tool. Compare EUR/USD & XAU/USD spreads, commissions per lot, execution speed, regulatory safety scores, and withdrawal speeds.',
    keywords:
      'compare forex brokers, forex broker comparison tool, side by side broker comparison, forex spread comparison, ECN vs STP broker fees, TradeSafe Brokers compare',
    breadcrumbName: 'Compare Brokers',
    pageType: 'WebApplication',
  },
  '/join-broker': {
    title: 'List & Verify Your Brokerage on PipWise | Partner With TradeSafe Brokers',
    description:
      'Submit your regulated Forex or CFD brokerage for independent compliance auditing, live spread benchmarking, and verified trader review listing on PipWise.',
    keywords:
      'list forex broker, submit brokerage review, forex broker partnership, verify forex broker, PipWise partner application, TradeSafe Brokers listing',
    breadcrumbName: 'List Your Brokerage',
    pageType: 'ContactPage',
  },
  '/privacy-policy': {
    title: 'Privacy Policy, Data Protection & Regulatory Disclosures | PipWise',
    description:
      'Read how PipWise by TradeSafe Brokers protects trader identity, OTP email verification security, cookies, and independent broker review integrity.',
    keywords:
      'PipWise privacy policy, TradeSafe Brokers terms, forex review data security, GDPR compliance',
    breadcrumbName: 'Privacy Policy',
    pageType: 'WebPage',
  },
  '/admin': {
    title: 'Admin Command Center | PipWise Management',
    description: 'Protected administrative dashboard for PipWise broker and review moderation.',
    keywords: '',
    breadcrumbName: 'Admin',
    noindex: true,
    pageType: 'WebPage',
  },
};

function upsertMeta(attrName, attrValue, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href, extraAttrs = {}) {
  let selector = `link[rel="${rel}"]`;
  if (extraAttrs.hreflang) {
    selector += `[hreflang="${extraAttrs.hreflang}"]`;
  }
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    Object.entries(extraAttrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export const SeoHead = ({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage = DEFAULT_IMAGE,
  noindex = false,
  customSchema = null,
}) => {
  const location = useLocation();
  const pathname = location.pathname || '/';

  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin');
    const routeMeta = ROUTE_SEO_CONFIG[pathname] || ROUTE_SEO_CONFIG['/'];

    const finalTitle = title || routeMeta.title;
    const finalDescription = description || routeMeta.description;
    const finalKeywords = keywords ?? routeMeta.keywords;
    const shouldNoIndex = Boolean(noindex || routeMeta.noindex || isAdmin);
    const cleanPath = (canonicalPath || pathname) === '/' ? '/' : (canonicalPath || pathname).replace(/\/+$/, '');
    const canonicalUrl = `${SITE_URL}${cleanPath}`;

    // 1. Update Document Title
    document.title = finalTitle;

    // 2. Update Primary Meta Tags
    upsertMeta('name', 'title', finalTitle);
    upsertMeta('name', 'description', finalDescription);
    if (finalKeywords) {
      upsertMeta('name', 'keywords', finalKeywords);
    }

    const robotsDirective = shouldNoIndex
      ? 'noindex, nofollow, noarchive'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    upsertMeta('name', 'robots', robotsDirective);
    upsertMeta('name', 'googlebot', robotsDirective);

    // 3. Update Canonical & Hreflang Links
    upsertLink('canonical', canonicalUrl);
    upsertLink('alternate', canonicalUrl, { hreflang: 'en' });
    upsertLink('alternate', canonicalUrl, { hreflang: 'x-default' });

    // 4. Update Open Graph Tags
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', finalTitle);
    upsertMeta('property', 'og:description', finalDescription);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', ogImage);

    // 5. Update Twitter / X Card Tags
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', finalTitle);
    upsertMeta('name', 'twitter:description', finalDescription);
    upsertMeta('name', 'twitter:url', canonicalUrl);
    upsertMeta('name', 'twitter:image', ogImage);

    // 6. Inject Dynamic Route-Specific Schema.org JSON-LD (WebPage + BreadcrumbList)
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
    ];

    if (cleanPath !== '/') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: routeMeta.breadcrumbName || 'Page',
        item: canonicalUrl,
      });
    }

    const routeSchemaGraph = [
      {
        '@type': routeMeta.pageType || 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: finalTitle,
        description: finalDescription,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        about: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ];

    if (customSchema) {
      routeSchemaGraph.push(customSchema);
    }

    let scriptEl = document.getElementById('structured-data-route');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.id = 'structured-data-route';
      document.head.appendChild(scriptEl);
    }

    scriptEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': routeSchemaGraph,
    });
  }, [pathname, title, description, keywords, canonicalPath, ogImage, noindex, customSchema]);

  return null;
};

export default SeoHead;
