import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import SONG_SERVICE from '../services/song.service';
import { getDisplayedZemaVerseSource } from '../config/zemaverse';
import { AuthContext } from '../context/AuthContext';
import {
  buildLyricsSlides,
  isLyricsHeading,
} from '../utils/lyricsPresentation';

function LyricsPresentation({ enableGlobalKeys, songName, version, versionIndex }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef(null);
  const lyricsSlides = buildLyricsSlides(version.text, songName);
  const slideCount = lyricsSlides.length;
  const currentLyrics = lyricsSlides[activeSlide] || [];
  const progress = slideCount > 0 ? ((activeSlide + 1) / slideCount) * 100 : 0;
  const headingId = `lyrics-heading-${versionIndex}`;

  useEffect(() => {
    setActiveSlide(0);
  }, [songName, version.text]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === stageRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyboardNavigation = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select')) {
        return;
      }

      const ownsKeyboard =
        enableGlobalKeys ||
        document.fullscreenElement === stageRef.current ||
        stageRef.current?.contains(document.activeElement);

      if (!ownsKeyboard) return;

      if (event.key === 'ArrowLeft') {
        setActiveSlide((current) => Math.max(0, current - 1));
      }

      if (event.key === 'ArrowRight') {
        setActiveSlide((current) => Math.min(Math.max(0, slideCount - 1), current + 1));
      }
    };

    window.addEventListener('keydown', handleKeyboardNavigation);
    return () => window.removeEventListener('keydown', handleKeyboardNavigation);
  }, [enableGlobalKeys, slideCount]);

  const toggleFullscreen = async () => {
    if (!stageRef.current || !document.fullscreenEnabled) return;

    if (document.fullscreenElement === stageRef.current) {
      await document.exitFullscreen();
    } else {
      await stageRef.current.requestFullscreen();
    }
  };

  return (
    <section
      className="lyrics-stage"
      aria-labelledby={headingId}
      lang={version.languageCode}
      ref={stageRef}
    >
      <div className="lyrics-stage-toolbar">
        <div>
          <span className="lyrics-stage-kicker">Sing-along view</span>
          <h2 id={headingId}>{version.language} lyrics</h2>
        </div>
        {document.fullscreenEnabled && (
          <button
            type="button"
            className="lyrics-fullscreen"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit full screen' : 'Open full screen'}
          >
            <span aria-hidden="true">{isFullscreen ? '✕' : '⛶'}</span>
            {isFullscreen ? 'Exit' : 'Full screen'}
          </button>
        )}
      </div>

      <div className="lyrics-slide" aria-live="polite" key={activeSlide}>
        <span className="lyrics-slide-ornament" aria-hidden="true">✥</span>
        {currentLyrics.length > 0 ? (
          <div className="lyrics-slide-lines">
            {currentLyrics.map((line, index) => (
              <div
                className={isLyricsHeading(line) ? 'lyrics-line lyrics-label' : 'lyrics-line'}
                key={`${line}-${index}`}
              >
                {line}
              </div>
            ))}
          </div>
        ) : (
          <p className="lyrics-empty">Lyrics have not been added yet.</p>
        )}
        <span className="lyrics-slide-ornament lyrics-slide-ornament-bottom" aria-hidden="true">✥</span>
      </div>

      {slideCount > 0 && (
        <div className="lyrics-navigation">
          <button
            type="button"
            className="lyrics-nav-button"
            onClick={() => setActiveSlide((current) => Math.max(0, current - 1))}
            disabled={activeSlide === 0}
          >
            <span aria-hidden="true">←</span>
            Previous
          </button>

          <div className="lyrics-progress" aria-label={`Part ${activeSlide + 1} of ${slideCount}`}>
            <div className="lyrics-progress-label">
              <span>Part {activeSlide + 1}</span>
              <span>{slideCount}</span>
            </div>
            <div className="lyrics-progress-track" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button
            type="button"
            className="lyrics-nav-button lyrics-nav-button-next"
            onClick={() => setActiveSlide((current) => Math.min(slideCount - 1, current + 1))}
            disabled={activeSlide === slideCount - 1}
          >
            Next
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      <div className="lyrics-stage-footer">
        <span>Use the ← and → arrow keys to move between parts</span>
        <Link to="/songs">Explore more songs</Link>
      </div>
    </section>
  );
}

LyricsPresentation.propTypes = {
  enableGlobalKeys: PropTypes.bool.isRequired,
  songName: PropTypes.string.isRequired,
  version: PropTypes.shape({
    language: PropTypes.string,
    languageCode: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  versionIndex: PropTypes.number.isRequired,
};

function Details() {
  const { id } = useParams();
  const { state } = useContext(AuthContext);
  const [song, setSong] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    SONG_SERVICE.getSongById(id)
      .then((res) => {
        setSong(res);
        setLoadError('');
      })
      .catch(() => setLoadError('This song could not be loaded. Please try again.'));
  }, [id]);

  if (loadError) {
    return (
      <div className="lyrics-status">
        <strong>{loadError}</strong>
        <Link to="/songs">Return to the song library</Link>
      </div>
    );
  }

  if (!song) {
    return <div className="lyrics-status">Loading lyrics…</div>;
  }

  const versions = song.lyrics?.length ? song.lyrics : [{
    language: song.primaryLanguage || 'Amharic',
    languageCode: song.primaryLanguageCode || 'am',
    text: song.verses || '',
  }];
  const displayedSource = getDisplayedZemaVerseSource(song);

  return (
    <article className="lyrics-page">
      <Link to="/songs" className="lyrics-back">
        <span aria-hidden="true">←</span> Back to song library
      </Link>

      <header className="lyrics-header">
        <span className="eyebrow">Multilingual lyrics</span>
        <h1>{song.songName}</h1>
        <div className="lyrics-meta">
          <span>{song.artistName || 'Traditional'}</span>
          {song.albumName && <span>Album: {song.albumName}{song.releaseYear ? ` (${song.releaseYear})` : ''}</span>}
          {song.trackNumber && <span>Track {song.trackNumber}</span>}
          {song.duration && <span>{song.duration}</span>}
          {song.genre && <span>{song.genre}</span>}
          {song.pageNumber && <span>ZM#{song.pageNumber}</span>}
        </div>
        {state.user?.username === 'cho' && (
          <Link to={`/songs/${song._id}/edit`} className="lyrics-edit-link">
            Edit song contents
          </Link>
        )}
      </header>

      {versions.map((version, versionIndex) => (
        <LyricsPresentation
          enableGlobalKeys={versions.length === 1}
          key={`${version.languageCode}-${versionIndex}`}
          songName={song.songName}
          version={version}
          versionIndex={versionIndex}
        />
      ))}

      {displayedSource && (
        <p className="lyrics-attribution">Source: {displayedSource}</p>
      )}

      {song.externalOnly && song.externalSourceUrl && (
        <aside className="external-lyrics-notice">
          <strong>Lyrics awaiting authorization</strong>
          <p>This catalog entry includes metadata only. Full lyrics have not been republished.</p>
          <a href={song.externalSourceUrl} target="_blank" rel="noreferrer">
            View original source
          </a>
        </aside>
      )}
    </article>
  );
}

export default Details;
