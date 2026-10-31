// Single source of truth for site-wide settings. Change the name here only.
export const SITE = {
  name: 'Kickback',
  tagline: 'All things uptempo and rawstyle, from a raver’s point of view', // also the home page H1 and the social preview image text
  homeTitle: 'Kickback | Uptempo & rawstyle rave reviews and tips', // <title> of the home page (keep under 60 characters)
  // Meta description (Google + social previews, RSS). The "Why Kickback exists" text on the home page is separate.
  description:
    'Uptempo and rawstyle rave reviews from my own experience: what it cost, how it scored and if it was worth it. Plus tips for your first big hardcore festival.',
  url: 'https://www.kickbacknl.app', // keep in sync with `site` in astro.config.mjs
  locale: 'en',
  author: 'Thijs Kraaijenbos',
};

// Analytics. Vercel Web Analytics is cookieless and always on in production.
// GA4 only loads after the visitor accepts cookies (EU rules). Leave empty to disable.
export const GA4_ID = 'G-XLXJXRQ43P';

// Newsletter sign-up (Resend, double opt-in; code in api/). Set to true once Resend is set up
// and RESEND_API_KEY is added in Vercel. While false, the email form is hidden.
export const NEWSLETTER_ENABLED = true;

// Community links. Leave a link empty ('') to hide it everywhere.
// While there is no WhatsApp/Discord group, the community block points to Instagram and TikTok.
export const COMMUNITY = {
  whatsapp: '',
  discord: '',
  instagram: 'https://www.instagram.com/thijskraaij06/',
  tiktok: 'https://www.tiktok.com/@thijskraaij06',
};

// Post categories (the `category` field in a post). Key = what you type, value = label on the site.
export const CATEGORIES = {
  review: 'Rave review',
  upcoming: 'Upcoming raves',
  'new-acts': 'New acts',
  outfits: 'Outfits',
  tips: 'Tips',
  guide: 'Guide',
} as const;
export type CategoryKey = keyof typeof CATEGORIES;
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]];

// Review scoring categories (the `verdict.scores` field), in display order.
export const VERDICT = {
  lineup: 'Lineup',
  atmosphere: 'Atmosphere',
  sound: 'Sound quality',
  location: 'Location',
  facilities: 'Facilities',
  logistics: 'Logistics',
  decoration: 'Decoration',
  price: 'Ticket price',
} as const;
export type VerdictKey = keyof typeof VERDICT;
export const VERDICT_KEYS = Object.keys(VERDICT) as [VerdictKey, ...VerdictKey[]];
