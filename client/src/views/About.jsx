import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';

const commitments = [
  ['Culture with context', 'We pair lyrics with artist profiles, languages, genres, and musical traditions so each song can be understood as more than a title.'],
  ['Useful multilingual access', 'ZemaVerse is designed for Amharic and other languages, helping readers explore original lyrics and available translations.'],
  ['Responsible stewardship', 'We identify sources, correct mistakes, review community submissions, and respond to creators or rights holders who contact us.'],
];

function About() {
  usePageMeta('About Us', 'Learn about ZemaVerse, its Ethiopian music preservation mission, editorial approach, and community commitments.', '/about');

  return (
    <div className="trust-page">
      <header className="trust-hero trust-hero-image">
        <span className="eyebrow">About ZemaVerse</span>
        <h1>Every song carries memory.</h1>
        <p>
          ZemaVerse is an independent digital library created to make Ethiopian
          lyrics, artists, languages, and musical traditions easier to discover
          and understand across generations.
        </p>
      </header>

      <section className="trust-section trust-story" aria-labelledby="our-story-title">
        <div>
          <span className="eyebrow">Our story</span>
          <h2 id="our-story-title">A welcoming home for Ethiopian music knowledge</h2>
        </div>
        <div>
          <p>
            Ethiopian music spans many languages, regions, eras, and styles.
            Valuable information is often scattered across recordings, album
            notes, family memories, and websites. ZemaVerse brings those paths
            together in a searchable library built for listeners, learners,
            diaspora families, artists, and researchers.
          </p>
          <p>
            Our aim is not merely to collect words. We want readers to meet the
            people behind the music, recognize traditions such as Tizita, Bati,
            Ambassel, Anchihoye, Ethio-jazz, and Ethio-pop, and find meaningful
            context for the songs they love.
          </p>
        </div>
      </section>

      <section className="trust-section" aria-labelledby="commitments-title">
        <span className="eyebrow">How we work</span>
        <h2 id="commitments-title">Our commitments</h2>
        <div className="trust-card-grid">
          {commitments.map(([title, text], index) => (
            <article className="trust-card" key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-callout">
        <div>
          <h2>Help make the library better.</h2>
          <p>Suggest a correction, share context, or ask about a rights concern.</p>
        </div>
        <Link className="trust-action" to="/contact">Contact ZemaVerse</Link>
      </section>
    </div>
  );
}

export default About;
