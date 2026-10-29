// Single source of truth for site-wide settings. Change the name here only.
export const SITE = {
  name: 'Kickback',
  tagline: 'Uptempo, rawstyle & rawtempo — from the front row.',
  homeTitle: 'Kickback | Dutch uptempo & rawstyle rave reviews', // <title> of the home page (keep under 60 characters)
  description:
    'Personal rave reviews, upcoming events, new DJ acts and rave outfits from the Dutch hardcore scene: uptempo, rawstyle and rawtempo.',
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
} as const;
export type CategoryKey = keyof typeof CATEGORIES;
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]];

// Review scoring categories (the `verdict.scores` field), in display order.
export const VERDICT = {
  lineup: 'Line-up',
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
