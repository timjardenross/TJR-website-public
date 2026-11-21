export type NavLink = { label: string; href: string };

export const navLinks: readonly NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'My Story', href: '/my-story' },
  { label: 'Speak Up', href: '/speak-up' },
  { label: 'Take Action', href: '/take-action' },
];

export const ctaLink: NavLink = { label: 'Get involved', href: '/get-involved' };

export const footerLinks: readonly NavLink[] = [
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms-conditions' },
  { label: 'RSS', href: '/library/rss.xml' },
  { label: 'Sitemap', href: '/sitemap.xml' },
  { label: 'Get involved', href: '/get-involved' },
];
