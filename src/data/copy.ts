// Call-to-action and newsletter texts shown on every post.
export const CTA_COPY = {
  community: {
    title: 'Rave with me',
    text: '', // optional line under the title; leave empty to show none
    button: 'Join the WhatsApp group',
    secondary: 'or the Discord',
    // Used while there is no WhatsApp/Discord group yet (empty links in src/consts.ts).
    followButton: 'Follow me on Instagram',
    followOr: 'or',
    followSecondary: 'Follow me on TikTok',
  },
  comment: {
    text: 'Got a tip, a question or a rave I should check out?',
    link: 'Tell me on Instagram',
  },
  // Home page hero, under the big headline.
  hero: {
    newsletter: 'Stay in the loop. Join the newsletter here!', // shown above the email form while there are no posts yet
    latestReview: 'Read the latest review',
    latestPost: 'Read the latest post', // when the newest post is not a review
    emailLink: 'Or stay in the loop by joining the newsletter!', // links to the form on the About page
  },
  newsletter: {
    title: 'Stay in the loop',
    text: "New rave reviews, scene updates and tips, straight to your inbox. Only when there's something new.",
    button: 'Sign up',
    privacy: 'Only used for this newsletter. Unsubscribe with one click.',
  },
};
