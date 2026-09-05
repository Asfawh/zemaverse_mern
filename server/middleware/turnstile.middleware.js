const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const CLOUDFLARE_TEST_SECRET_KEY =
  '1x0000000000000000000000000000000AA';
const MAX_TOKEN_LENGTH = 2048;
const DEFAULT_PRODUCTION_HOSTNAMES = ['zemaverse.com', 'www.zemaverse.com'];

function isProduction() {
  return (
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    process.env.NODE_ENV === 'production'
  );
}

function getSecretKey() {
  if (process.env.TURNSTILE_SECRET_KEY?.trim()) {
    return process.env.TURNSTILE_SECRET_KEY.trim();
  }

  if (!isProduction()) {
    return CLOUDFLARE_TEST_SECRET_KEY;
  }

  return '';
}

function getAllowedHostnames() {
  const configured = process.env.TURNSTILE_HOSTNAMES
    ?.split(',')
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);

  return new Set(
    configured?.length ? configured : DEFAULT_PRODUCTION_HOSTNAMES
  );
}

function requireTurnstile(expectedAction) {
  return async function verifyTurnstile(req, res, next) {
    const secretKey = getSecretKey();

    if (
      !secretKey ||
      (isProduction() && secretKey === CLOUDFLARE_TEST_SECRET_KEY)
    ) {
      return res.status(503).json({
        message: 'Human verification is not configured. Please try again later.',
      });
    }

    const token = req.body?.turnstileToken;
    if (
      !token ||
      typeof token !== 'string' ||
      token.length > MAX_TOKEN_LENGTH
    ) {
      return res.status(400).json({
        message: 'Please complete the security check and try again.',
      });
    }

    try {
      const body = new URLSearchParams({
        secret: secretKey,
        response: token,
      });
      const forwardedFor = req.get?.('x-forwarded-for')?.split(',')[0]?.trim();
      if (forwardedFor) body.set('remoteip', forwardedFor);

      const response = await fetch(VERIFY_URL, {
        method: 'POST',
        body,
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) throw new Error(`Turnstile returned ${response.status}`);

      const result = await response.json();
      const usesTestCredentials = secretKey === CLOUDFLARE_TEST_SECRET_KEY;
      const validAction = usesTestCredentials || result.action === expectedAction;
      const validHostname =
        usesTestCredentials ||
        getAllowedHostnames().has(result.hostname?.toLowerCase());

      if (!result.success || !validAction || !validHostname) {
        return res.status(400).json({
          message: 'Security check expired or failed. Please try again.',
        });
      }

      delete req.body.turnstileToken;
      return next();
    } catch (error) {
      console.error('Turnstile verification unavailable', error);
      return res.status(503).json({
        message: 'Security check is temporarily unavailable. Please try again.',
      });
    }
  };
}

export default requireTurnstile;
