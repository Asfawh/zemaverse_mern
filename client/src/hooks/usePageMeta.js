import { useEffect } from 'react';

const defaultDescription = 'Explore Ethiopian song lyrics, artist profiles, musical traditions, and stories on ZemaVerse.';

function usePageMeta(title, description = defaultDescription, path = '/') {
  useEffect(() => {
    document.title = `${title} | ZemaVerse`;

    const meta = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const url = `https://zemaverse.com${path}`;

    meta?.setAttribute('content', description);
    canonical?.setAttribute('href', url);
    ogTitle?.setAttribute('content', `${title} | ZemaVerse`);
    ogDescription?.setAttribute('content', description);
    ogUrl?.setAttribute('content', url);
  }, [title, description, path]);
}

export default usePageMeta;
