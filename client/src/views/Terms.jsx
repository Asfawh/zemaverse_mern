import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';

function Terms() {
  usePageMeta('Terms of Use', 'Read the ZemaVerse terms covering community contributions, copyright, acceptable use, and corrections.', '/terms');

  return (
    <article className="policy-page">
      <header>
        <span className="eyebrow">Community standards</span>
        <h1>Terms of Use</h1>
        <p>Last updated: August 31, 2026</p>
      </header>

      <section>
        <h2>Purpose of the service</h2>
        <p>ZemaVerse provides educational and cultural information about Ethiopian music, lyrics, artists, languages, and traditions. Information may be corrected, expanded, or removed as new and more reliable sources become available.</p>
      </section>
      <section>
        <h2>Copyright and attribution</h2>
        <p>Lyrics, photographs, recordings, names, and other creative works may be protected by copyright or other rights belonging to their respective owners. ZemaVerse does not claim ownership of third-party works merely because they appear in the library. Where material is submitted or reproduced, contributors must have the right to share it or provide enough information for us to evaluate its use.</p>
      </section>
      <section>
        <h2>Rights-holder requests</h2>
        <p>Artists, songwriters, publishers, photographers, and other rights holders may request a correction, attribution update, review, or removal. Email <a href="mailto:contact@zemaverse.com?subject=Rights%20request">contact@zemaverse.com</a> with the page address, description of the work, your relationship to it, and the requested action.</p>
      </section>
      <section>
        <h2>Community contributions</h2>
        <p>By submitting content, you confirm that the submission is accurate to the best of your knowledge, does not violate another person’s rights, and may be displayed and edited for clarity and formatting. Do not submit hateful, violent, sexually explicit, deceptive, unlawful, or malicious content.</p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>Do not attempt to disrupt the service, bypass security, scrape the site in a harmful or excessive manner, impersonate another person, manipulate advertising, or encourage invalid ad clicks. We may restrict access or remove content to protect the library and its users.</p>
      </section>
      <section>
        <h2>No guarantee</h2>
        <p>The service is provided on an “as available” basis. We work to improve accuracy and availability but cannot guarantee that every lyric, translation, biography, source, or service feature is complete or error-free.</p>
      </section>
      <section>
        <h2>Questions</h2>
        <p>For questions about these terms, use our <Link to="/contact">Contact Us page</Link>.</p>
      </section>
    </article>
  );
}

export default Terms;
