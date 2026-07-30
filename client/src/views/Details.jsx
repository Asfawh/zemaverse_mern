import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SONG_SERVICE from '../services/song.service';
import { getDisplayedZemaVerseSource } from '../config/zemaverse';
import { AuthContext } from '../context/AuthContext';

const isLyricsHeading = (line) => (
  /^(chorus|refrain|verse|meaning|translation)\b[\s.:…-]*/i.test(line.trim())
);

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
          {song.genre && <span>{song.genre}</span>}
          {song.pageNumber && <span>ZM#{song.pageNumber}</span>}
          {displayedSource && <span>Source: {displayedSource}</span>}
        </div>
        {state.user?.username === 'cho' && (
          <Link to={`/songs/${song._id}/edit`} className="lyrics-edit-link">
            Edit song contents
          </Link>
        )}
      </header>

      {versions.map((version, versionIndex) => {
        const lines = version.text.replace(/\r\n?/g, '\n').trim().split('\n');
        return <section className="lyrics-sheet" aria-labelledby={`lyrics-heading-${versionIndex}`}
          key={`${version.languageCode}-${versionIndex}`} lang={version.languageCode}>
        <div className="lyrics-sheet-heading">
          <span className="lyrics-ornament" aria-hidden="true">✥</span>
          <h2 id={`lyrics-heading-${versionIndex}`}>{version.language} lyrics</h2>
          <span className="lyrics-ornament" aria-hidden="true">✥</span>
        </div>

        <div className="lyrics-body">
          {lines.length > 0 ? lines.map((line, index) => {
            if (!line.trim()) {
              return <div className="lyrics-stanza-break" aria-hidden="true" key={`break-${index}`} />;
            }

            return (
              <div
                className={isLyricsHeading(line) ? 'lyrics-line lyrics-label' : 'lyrics-line'}
                key={`${line}-${index}`}
              >
                {line.trim()}
              </div>
            );
          }) : (
            <p className="lyrics-empty">Lyrics have not been added yet.</p>
          )}
        </div>

        <footer className="lyrics-sheet-footer">
          <span>{song.songName}</span>
          <Link to="/songs">Explore more songs</Link>
        </footer>
      </section>;
      })}
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
