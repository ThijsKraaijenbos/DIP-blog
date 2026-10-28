// Single source of truth for site-wide settings. Change the name here only.
export const SITE = {
  name: 'Kickback',
  tagline: 'Uptempo, rawstyle & rawtempo — from the front row.',
  description:
    'Personal rave reviews, upcoming events, new DJ acts and rave outfits from the Dutch hardcore scene: uptempo, rawstyle and rawtempo.',
  url: 'https://www.kickbacknl.app', // keep in sync with `site` in astro.config.mjs
  locale: 'en',
  author: 'Thijs Kraaijenbos',
};

// Analytics: leave empty to disable. Scripts only load when filled in.
export const GA4_ID = ''; // e.g. 'G-XXXXXXXXXX'
export const SEARCH_CONSOLE_VERIFICATION = ''; // content of the google-site-verification meta tag

// Community links (placeholders — replace with real invite links).
export const COMMUNITY = {
  discord: 'https://discord.gg/your-invite',
  whatsapp: 'https://chat.whatsapp.com/your-invite',
  instagram: 'https://instagram.com/your-handle',
};
