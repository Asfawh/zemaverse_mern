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
      <header className="trust-hero trust-hero-image trust-hero-compact">
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
          <article className="contact-reason contact-batch-card">
            <span className="eyebrow">Shared contribution folder</span>
            <h2>Have a batch of Ethiopian song files?</h2>
            <p>Send recordings, authorized lyric documents, album notes, images, or a shared-folder link and we can prepare them for the library.</p>
            <ol>
              <li>Put the files in one folder or attach a small batch.</li>
              <li>Include each song title, artist, language, album, genre, and source when known.</li>
              <li>Tell us whether you have permission to share any lyrics or images.</li>
            </ol>
            <a className="trust-action" href="mailto:chosky05@gmail.com?subject=ZemaVerse%20batch%20contribution&body=Folder%20link%3A%0A%0AWhat%20is%20included%3A%0A%0ASource%20or%20permission%20details%3A%0A">Send a batch contribution</a>
          </article>
        </div>
        <aside className="contact-card">
          <span className="eyebrow">Email</span>
          <h2>chosky05@gmail.com</h2>
          <p>We review messages as promptly as possible. Rights and safety concerns receive priority.</p>
          <a className="trust-action" href="mailto:chosky05@gmail.com?subject=ZemaVerse%20inquiry">Send an email</a>
          <div className="contact-phone">
            <span className="eyebrow">Phone</span>
            <a href="tel:+12409206006">(240) 920-6006</a>
          </div>
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
