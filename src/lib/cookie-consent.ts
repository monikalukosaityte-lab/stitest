export const CONSENT_KEY = 'sti-cookie-choice';
export const CONSENT_DAYS = 180;
export const GA_MEASUREMENT_ID = 'G-90V3D10GNM';

export type CookieChoice = {
  version: 1;
  analytics: boolean;
  expiresAt: number;
};

type AnalyticsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
} & Partial<Record<`ga-disable-${typeof GA_MEASUREMENT_ID}`, boolean>>;

export function readCookieChoice(now = Date.now()): CookieChoice | null {
  try {
    const value = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null');
    if (
      value?.version === 1 &&
      typeof value.analytics === 'boolean' &&
      Number.isFinite(value.expiresAt) &&
      value.expiresAt > now &&
      value.expiresAt <= now + CONSENT_DAYS * 86400000
    ) {
      return value;
    }
  } catch {
    // Unavailable storage must never imply permission to track.
  }
  return null;
}

export function saveCookieChoice(analytics: boolean): CookieChoice {
  const choice: CookieChoice = {
    version: 1,
    analytics,
    expiresAt: Date.now() + CONSENT_DAYS * 86400000,
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));
  } catch {
    // A full store can reject writes while still retaining an older acceptance.
    // Remove it where possible so a failed save cannot restore stale permission.
    try {
      localStorage.removeItem(CONSENT_KEY);
    } catch {
      // Fully unavailable storage is treated as no choice on the next visit.
    }
  }
  return choice;
}

export function startAnalytics() {
  // Enable only after the stream's enhanced measurement has been disabled and
  // outgoing requests verified. Manual pageviews alone cannot override it.
  if (process.env.NEXT_PUBLIC_GA_ENABLED !== 'true') return;
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  if (document.getElementById('sti-analytics')) return;

  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.gtag = (...args) => analyticsWindow.dataLayer!.push(args);
  const gtag = analyticsWindow.gtag;
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  gtag('consent', 'update', { analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: CONSENT_DAYS * 86400,
    cookie_flags: 'SameSite=Lax;Secure',
    // Condition-specific paths, titles, queries and referrers stay out of GA.
    page_location: `${window.location.origin}/`,
    page_title: 'STI Test Kit',
    page_referrer: '',
  });

  const script = document.createElement('script');
  script.id = 'sti-analytics';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackPageView(pathname: string) {
  const analyticsWindow = window as AnalyticsWindow;
  if (analyticsWindow[`ga-disable-${GA_MEASUREMENT_ID}`]) return;
  const pageType = pathname.startsWith('/rapid-tests/')
    ? 'product'
    : pathname.startsWith('/blog/')
      ? 'guide'
      : pathname === '/'
        ? 'home'
        : 'information';
  analyticsWindow.gtag?.('event', 'page_view', {
    page_location: `${window.location.origin}/${pageType === 'home' ? '' : pageType}`,
    page_title: 'STI Test Kit',
    page_referrer: '',
    page_type: pageType,
  });
}

/** Returns whether a reload is needed to remove already running tag listeners. */
export function stopAnalytics(): boolean {
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  const script = document.getElementById('sti-analytics');
  const wasRunning = Boolean(script || analyticsWindow.gtag);
  script?.remove();
  analyticsWindow.gtag = undefined;
  analyticsWindow.dataLayer = [];

  const host = window.location.hostname;
  const domains = new Set(['', host, `.${host}`]);
  if (host.startsWith('www.')) {
    domains.add(host.slice(4));
    domains.add(`.${host.slice(4)}`);
  }
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain ? `; Domain=${domain}` : ''}`;
    }
  }
  return wasRunning;
}
