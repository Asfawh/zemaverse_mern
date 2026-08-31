const donationUrl = import.meta.env.VITE_DONATION_URL?.trim() || '';
const hasSecureDonationUrl = /^https:\/\//i.test(donationUrl);

const supportAreas = [
  {
    number: '01',
    title: 'Cloud hosting',
    description: 'AWS hosting keeps the lyrics library fast and available worldwide.',
  },
  {
    number: '02',
    title: 'Reliability & security',
    description: 'Monitoring, backups, security, and domain costs.',
  },
  {
    number: '03',
    title: 'Preservation & growth',
    description: 'More Ethiopian lyrics, artist profiles, languages, and community tools.',
  },
];

function Support() {
  return (
    <div className="support-page">
      <section className="support-hero" aria-labelledby="support-title">
        <div className="support-hero-copy">
          <span className="eyebrow">Keep ZemaVerse growing</span>
          <h1 id="support-title">Support ZemaVerse.</h1>
          <p>
            Help us preserve and share Ethiopian songs, artists, and lyrics.
            Your gift keeps the library online, secure, and growing.
          </p>
          <p className="support-amharic" lang="am">
            ድጋፍዎ የኢትዮጵያ ሙዚቃና ግጥሞች ማኅደር ተደራሽ እና ቀጣይ እንዲሆን ይረዳል።
          </p>
        </div>
      </section>

      <section className="support-content" aria-label="Donation information">
        <article className="support-impact-card">
          <span className="eyebrow">Your support</span>
          <h2>What your gift supports</h2>
          <p className="support-intro">
            Contributions help operate and improve ZemaVerse.com.
          </p>
          <div className="support-area-list">
            {supportAreas.map((area) => (
              <div className="support-area" key={area.number}>
                <span>{area.number}</span>
                <div>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="support-checkout-card">
          <div className="support-checkout-icon" aria-hidden="true">♥</div>
          <span className="support-kicker">Give securely</span>
          <h2>Become a supporter</h2>
          <p>Choose any amount on our payment provider&apos;s secure checkout.</p>

          {hasSecureDonationUrl ? (
            <a className="support-primary-action" href={donationUrl} target="_blank" rel="noopener noreferrer">
              Continue to secure donation
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <div className="support-setup-note" role="status">
              <strong>Online contributions are being prepared.</strong>
              <span>Contact us for the available ways to support ZemaVerse.</span>
              <a href="mailto:chosky05@gmail.com?subject=Supporting%20ZemaVerse">
                Contact us to support
              </a>
            </div>
          )}

          <p className="support-security-note">
            ZemaVerse.com does not collect or store card details. Contributions
            are not represented as tax-deductible unless an eligible
            organization provides a receipt stating otherwise.
          </p>
        </aside>
      </section>

      <section className="support-thanks">
        <span aria-hidden="true">✦</span>
        <div>
          <h2>Thank you for helping this work continue.</h2>
          <p>Your generosity helps Ethiopian music and lyrics reach new generations.</p>
        </div>
      </section>
    </div>
  );
}

export default Support;
