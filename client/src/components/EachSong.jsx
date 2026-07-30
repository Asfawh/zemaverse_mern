/* react */
/* react bootstrap */
import Card from 'react-bootstrap/Card';

/* react router */
import { Link } from 'react-router-dom';
import { getDisplayedZemaVerseSource } from '../config/zemaverse';

function EachSong({
  song,
  user = null,
  onReaction = null,
  reactionBusy = false,
}) {
  const displayedSource = getDisplayedZemaVerseSource(song);
  const counts = song.reactionCounts || { like: 0, love: 0 };
  const canReact = Boolean(user && onReaction);
  const primaryLyrics = song.lyrics?.[0]?.text || song.verses || '';
  const verseLines = primaryLyrics
    ?.replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const previewLines = verseLines?.slice(0, 4) || [];
  const hasMoreLyrics = (verseLines?.length || 0) > previewLines.length;

  return (
    <Card className="song-card">
      <div className="song-card-accent" aria-hidden="true"></div>
      <Card.Body>
        <div className="song-card-topline">
          <span className="genre-pill">{song.genre || 'Lyrics'}</span>
          {song.pageNumber && (
            <span className="zemaverse-number">ZM#{song.pageNumber}</span>
          )}
        </div>
        <Card.Title>{song.songName}</Card.Title>
        <Card.Text className="song-artist">
          {song.artistName || 'Traditional'}
        </Card.Text>
        <Card.Text className="song-file">
          {(song.lyrics?.length ? song.lyrics : [{ language: song.primaryLanguage || 'Amharic' }])
            .map((item) => item.language).filter(Boolean).join(' · ')}
        </Card.Text>
        {displayedSource && (
          <Card.Text className="song-file">Source: {displayedSource}</Card.Text>
        )}
        {previewLines.length > 0 && (
          <div className="song-preview" aria-label="Lyrics preview">
            {previewLines.map((line, index) => (
              <span key={`${line}-${index}`}>{line}</span>
            ))}
            {hasMoreLyrics && <span className="song-preview-more" aria-hidden="true">…</span>}
          </div>
        )}
        {song.externalOnly && (
          <div className="metadata-only-badge">Metadata entry · lyrics pending</div>
        )}
        <div className="reaction-row" aria-label={`Reactions for ${song.songName}`}>
          <button
            type="button"
            className={`reaction-button ${song.userReaction === 'like' ? 'is-active is-like' : ''}`}
            aria-pressed={song.userReaction === 'like'}
            disabled={!canReact || reactionBusy}
            title={canReact ? 'Like this ZemaVerse' : 'Log in to Like this ZemaVerse'}
            onClick={() => onReaction?.(song, 'like')}
          >
            <span aria-hidden="true">👍</span>
            <span>Like</span>
            <strong>{counts.like || 0}</strong>
          </button>
          <button
            type="button"
            className={`reaction-button ${song.userReaction === 'love' ? 'is-active is-love' : ''}`}
            aria-pressed={song.userReaction === 'love'}
            disabled={!canReact || reactionBusy}
            title={canReact ? 'Love this ZemaVerse' : 'Log in to Love this ZemaVerse'}
            onClick={() => onReaction?.(song, 'love')}
          >
            <span aria-hidden="true">♥</span>
            <span>Love</span>
            <strong>{counts.love || 0}</strong>
          </button>
        </div>
        {!user && <span className="reaction-signin-note">Log in to react and save favorites</span>}
      </Card.Body>
      <Card.Footer>
        <Link to={`/songs/${song._id}`} className="song-link">
          Read lyrics <span aria-hidden="true">→</span>
        </Link>
      </Card.Footer>
    </Card>
  );
}

export default EachSong;
