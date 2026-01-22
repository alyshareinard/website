export type AppMeta = {
  appName: string;
  companyName: string;
  contactEmail: string;
  supportEmail?: string;
  supportUrl?: string;
  dataCollected: string[];
};

export const defaultAppMeta: AppMeta = {
  appName: 'Balzac Cocoa Rater',
  companyName: 'Tech Aly',
  contactEmail: 'alysha@tech-aly.com',
  supportEmail: 'alysha@tech-aly.com',
  supportUrl: undefined,
  dataCollected: ['Usage data', 'Ratings (not tied to identity)']
};

export function metaFromSearchParams(url: URL, fallback: AppMeta = defaultAppMeta): AppMeta {
  const appName = url.searchParams.get('app') ?? fallback.appName;
  const companyName = url.searchParams.get('company') ?? fallback.companyName;
  const contactEmail = url.searchParams.get('email') ?? fallback.contactEmail;
  const supportEmail = url.searchParams.get('supportEmail') ?? fallback.supportEmail;
  const supportUrl = url.searchParams.get('supportUrl') ?? fallback.supportUrl ?? undefined;
  const data = url.searchParams.getAll('data');
  const dataCollected = data.length > 0 ? data : fallback.dataCollected;
  return { appName, companyName, contactEmail, supportEmail, supportUrl, dataCollected };
}
