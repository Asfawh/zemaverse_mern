import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';

function Privacy() {
  usePageMeta('Privacy Policy', 'Read how ZemaVerse handles account information, cookies, advertising, analytics, and privacy choices.', '/privacy');

  return (
    <article className="policy-page">
      <header>
        <span className="eyebrow">Transparency</span>
        <h1>Privacy Policy</h1>
        <p>Last updated: August 31, 2026</p>
      </header>

      <section>
        <h2>Information we handle</h2>
        <p>ZemaVerse may process information you provide when creating an account, saving favorites, submitting or editing content, or contacting us. This may include a username, email address, account activity, and the content of your message or contribution.</p>
      </section>
      <section>
        <h2>Cookies and local storage</h2>
        <p>We may use cookies or browser storage to maintain sessions, protect accounts, remember preferences, measure site performance, and support advertising. You can control cookies through your browser and, where required, through the consent choices presented on the site.</p>
      </section>
      <section>
        <h2>Google AdSense</h2>
        <p>We use Google AdSense to support the operation of ZemaVerse. Google and its partners may use cookies or similar technologies to serve, personalize, and measure ads, subject to your consent choices and applicable law. Learn how Google uses information from sites that use its services on the <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google partner sites policy page</a>.</p>
      </section>
      <section>
        <h2>Service providers and security</h2>
        <p>We use service providers for hosting, database storage, security, and site delivery. We share information only as needed to operate the service, comply with law, protect users, or address misuse. No internet service can promise absolute security, but we use reasonable technical and organizational safeguards.</p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>You may ask about, correct, or request deletion of personal information associated with your ZemaVerse account, subject to legal and operational requirements. Contact us at <a href="mailto:contact@zemaverse.com?subject=Privacy%20request">contact@zemaverse.com</a>.</p>
      </section>
      <section>
        <h2>Updates</h2>
        <p>We may update this policy as the service or legal requirements change. The date above identifies the latest revision. Questions can be submitted through our <Link to="/contact">Contact Us page</Link>.</p>
      </section>
    </article>
  );
}

export default Privacy;
