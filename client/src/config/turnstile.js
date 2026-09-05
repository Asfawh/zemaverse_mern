const CLOUDFLARE_TEST_SITE_KEY = '1x00000000000000000000AA';

const configuredSiteKey =
  import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || '';

export const turnstileSiteKey =
  configuredSiteKey || (import.meta.env.DEV ? CLOUDFLARE_TEST_SITE_KEY : '');

export const turnstileEnabled = Boolean(turnstileSiteKey);

export const turnstileConfigurationError =
  import.meta.env.PROD && !configuredSiteKey
    ? 'Human verification is temporarily unavailable. Please try again later.'
    : '';
