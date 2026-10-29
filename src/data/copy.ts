// Call-to-action and newsletter texts shown on every post.
// TODO(Thijs): replace every placeholder below with your own words.
export const CTA_COPY = {
  community: {
    title: 'Rave with me',
    text: 'Write your community invite here: what people get in the group chat and why they should join.',
    button: 'Join the WhatsApp group',
    secondary: 'or the Discord',
    // Used while there is no WhatsApp/Discord group yet (empty links in src/consts.ts).
    followButton: 'Follow me on Instagram',
    followOr: 'or',
    followSecondary: 'Follow me on TikTok',
  },
  comment: {
    text: 'Write your comment prompt here: ask readers one question about this post.',
    link: 'Tell me on Instagram',
  },
  // Home page hero, under the big headline. TODO(Thijs): change these to your own words if you like.
  hero: {
    newsletter: 'New reviews in your inbox.', // shown above the email form while there are no posts yet
    latestReview: 'Read the latest review',
    latestPost: 'Read the latest post', // when the newest post is not a review
    emailLink: 'or get new reviews by email', // links to the form on the About page
  },
  newsletter: {
    title: 'Get the next review',
    text: 'Write your newsletter pitch here: what lands in the inbox and how often.',
    button: 'Sign up',
    privacy: 'Only used for this newsletter. Unsubscribe with one click.',
  },
};
