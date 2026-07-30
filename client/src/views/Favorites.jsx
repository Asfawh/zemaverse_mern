import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import EachSong from '../components/EachSong';
import { AuthContext } from '../context/AuthContext';
import styles from '../css/song-list.module.css';
import REACTION_SERVICE from '../services/reaction.service';

function Favorites() {
  const {
    state: { user },
  } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reactionError, setReactionError] = useState('');
  const [busySongId, setBusySongId] = useState(null);

  useEffect(() => {
    if (!user?.token) {
      setFavorites([]);
      setIsLoaded(true);
      return;
    }

    let active = true;
    setIsLoaded(false);

    REACTION_SERVICE.getFavorites(user.token)
      .then((songs) => {
        if (!active) return;
        setFavorites(songs);
        setLoadError('');
        setIsLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setLoadError('Your favorites could not be loaded. Please try again.');
        setIsLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [user?.token]);

  const handleReaction = async (song, kind) => {
    if (!user?.token || busySongId) return;

    const nextKind = song.userReaction === kind ? null : kind;
    setBusySongId(song._id);
    setReactionError('');

    try {
      const updatedSong = await REACTION_SERVICE.setReaction(
        song._id,
        nextKind,
        user.token
      );

      setFavorites((current) => {
        const remaining = current.filter((favorite) => favorite._id !== song._id);
        return updatedSong.userReaction ? [updatedSong, ...remaining] : remaining;
      });
    } catch {
      setReactionError('Your reaction could not be saved. Please try again.');
    } finally {
      setBusySongId(null);
    }
  };

  if (!user) {
    return (
      <section className="favorites-page">
        <div className="favorites-hero">
          <span className="eyebrow">Your personal collection</span>
          <h1>Favorite ZemaVerse</h1>
          <p>Log in to Like or Love ZemaVerse and keep them together here.</p>
        </div>
        <div className="favorites-empty">
          <strong>Sign in to see your favorites.</strong>
          <Link to="/songs">Explore the song library</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="favorites-page">
      <div className="favorites-hero">
        <span className="eyebrow">Your personal collection</span>
        <h1>Favorite ZemaVerse</h1>
        <p>
          Every ZemaVerse you Like or Love is saved here, with your newest
          favorites first.
        </p>
        <span className="favorites-count">
          {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'}
        </span>
      </div>

      {reactionError && <div className="alert alert-danger">{reactionError}</div>}
      {!isLoaded && <div className="empty-state">Loading your favorites…</div>}
      {loadError && <div className="alert alert-danger">{loadError}</div>}
      {isLoaded && !loadError && favorites.length === 0 && (
        <div className="favorites-empty">
          <strong>Your favorites list is waiting.</strong>
          <span>Choose Like or Love on any ZemaVerse to save it here.</span>
          <Link to="/songs">Browse ZemaVerse</Link>
        </div>
      )}

      <div className={styles.grid}>
        {favorites.map((song) => (
          <EachSong
            key={song._id}
            song={song}
            user={user}
            onReaction={handleReaction}
            reactionBusy={Boolean(busySongId)}
          />
        ))}
      </div>
    </section>
  );
}

export default Favorites;
