import { Link } from 'react-router-dom';
import SONG_SERVICE from '../services/song.service';
/* react */
import { useContext } from 'react';

/* local */
import { AuthContext } from '../context/AuthContext';
import { getDisplayedZemaVerseSource } from '../config/zemaverse';

function SongRow({ song, setIsLoaded }) {
  const {
    state: { user },
  } = useContext(AuthContext);
  const displayedSource = getDisplayedZemaVerseSource(song);
  const removeSong = async (id) => {
    if (!window.confirm('Remove this ZemaVerse from the library?')) return;
    await SONG_SERVICE.deleteSongById(id);
    setIsLoaded(false);
  };
  return (
    <tr>
      <td className="align-middle manager-song-title">
        <Link to={`/songs/${song._id}`}>{song.songName}</Link>
      </td>
      <td className="align-middle">{song.artistName}</td>
      <td className="align-middle"><span className="table-genre">{song.genre}</span></td>
      <td className="align-middle manager-source">{displayedSource}</td>
      <td className="align-middle d-flex gap-2">
        {user && user.id === song.createdBy ?
        (
          <Link to={`/songs/${song._id}/edit`} className="btn btn-sm btn-outline-secondary">
            Update
          </Link>
        )
        : (
          ''
        )}
        {user && user.id === song.createdBy ? (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => removeSong(song._id)}
          >
            Remove
          </button>
        ) : (
          ''
        )}
      </td>
    </tr>
  );
}
export default SongRow;
