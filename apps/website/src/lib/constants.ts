export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://varmanai.com';
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export const CHROME_STORE_URL = process.env.NEXT_PUBLIC_CHROME_STORE_URL ?? '#';
export const EDGE_STORE_URL = process.env.NEXT_PUBLIC_EDGE_STORE_URL ?? '#';

export const PLANS = {
  free: {
    name: 'Free',
    priceMonthly: 0,
    scansPerDay: 50,
  },
  pro: {
    name: 'Pro',
    priceMonthly: 19900,
    priceAnnual: 190800,
    scansPerDay: null,
  },
  team: {
    name: 'Team',
    priceMonthly: 14900,
    minSeats: 5,
    scansPerDay: null,
  },
} as const;
