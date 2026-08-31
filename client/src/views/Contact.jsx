import usePageMeta from '../hooks/usePageMeta';

const contactReasons = [
  ['Corrections', 'Report an incorrect title, artist, lyric, language, genre, or translation.'],
  ['Rights & attribution', 'Creators and rights holders can request attribution changes, review, or removal.'],
  ['Contributions', 'Suggest a song, artist profile, translation, historical note, image, or source.'],
  ['General questions', 'Ask about ZemaVerse, partnerships, accessibility, or technical issues.'],
];

function Contact() {
  usePageMeta('Contact Us', 'Contact ZemaVerse about corrections, contributions, copyright, attribution, partnerships, or support.', '/contact');

  return (
    <div className="trust-page">
      <header className="trust-hero trust-hero-compact">
        <span className="eyebrow">Contact Us</span>
        <h1>We welcome thoughtful messages.</h1>
        <p>
          The most useful messages include the song or artist name, the page
          address, and a reliable source when one is available.
        </p>
      </header>

      <section className="contact-layout">
        <div className="contact-reasons">
          {contactReasons.map(([title, text]) => (
            <article className="contact-reason" key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <aside className="contact-card">
          <span className="eyebrow">Email</span>
          <h2>chosky05@gmail.com</h2>
          <p>We review messages as promptly as possible. Rights and safety concerns receive priority.</p>
          <a className="trust-action" href="mailto:chosky05@gmail.com?subject=ZemaVerse%20inquiry">Send an email</a>
          <div className="contact-note">
            <strong>Rights or removal request?</strong>
            <span>Use the subject “Rights request” and identify the material, your relationship to it, and the requested action.</span>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Contact;
