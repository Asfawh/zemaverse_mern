import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import SONG_SERVICE from '../services/song.service';
import { AuthContext } from '../context/AuthContext';
import { ZEMAVERSE_GENRES } from '../config/genres';

const UpdateForm = () => {
  const { state } = useContext(AuthContext);
  const initialSong = {
    songName: '',
    artistName: '',
    source: '',
    verses: '',
    primaryLanguage: 'Amharic',
    primaryLanguageCode: 'am',
    genre: '',
    createdBy: state.user?.id,
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(initialSong);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (state.user && state.user.username !== 'cho') {
      navigate('/songs');
    }
    SONG_SERVICE.getSongById(id)
      .then((res) => setSong({
        ...res,
        source: res.source || '',
        verses: res.lyrics?.[0]?.text || res.verses || '',
        primaryLanguage: res.lyrics?.[0]?.language || res.primaryLanguage || 'Amharic',
        primaryLanguageCode: res.lyrics?.[0]?.languageCode || res.primaryLanguageCode || 'am',
      }))
      .catch((err) => console.log(err));
  }, [id, state.user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSong((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lyrics = song.verses.trim() ? [{
      language: song.primaryLanguage,
      languageCode: song.primaryLanguageCode,
      title: song.songName,
      text: song.verses,
    }] : [];
    SONG_SERVICE.updateSongById(id, {
      ...song,
      lyrics,
      externalOnly: lyrics.length === 0,
      rightsStatus: lyrics.length > 0 ? 'authorized' : 'metadata-only',
    }, state.user?.token)
      .then(() => navigate(`/songs/${id}`))
      .catch((err) => setErrors(err.response?.data?.errors || {
        general: { message: err.response?.data?.message || 'Update failed.' },
      }));
  };

  return (
    <div className="card shadow">
      <h3 className="card-header text-center">Edit</h3>
      <p className="text-center mt-3">Edit song metadata and authorized lyrics</p>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            {errors.songName && (
              <p className="error">{errors.songName.message}</p>
            )}
            <label htmlFor="songName" className="form-label">
              Song title *
            </label>
            <input
              type="text"
              name="songName"
              id="songName"
              value={song.songName}
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            {errors.artistName && (
              <p className="error">{errors.artistName.message}</p>
            )}
            <label htmlFor="artistName" className="form-label">
              Artist name *
            </label>
            <input
              type="text"
              name="artistName"
              id="artistName"
              value={song.artistName}
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            {errors.genre && <p className="error">{errors.genre.message}</p>}
            <label htmlFor="genre" className="form-label">
              Ethiopian Genre *
            </label>
            <select
              name="genre"
              id="genre"
              className="form-select"
              value={song.genre}
              onChange={handleChange}
            >
              {ZEMAVERSE_GENRES.map((genreType) => (
                <option key={genreType} value={genreType}>
                  {genreType}
                </option>
              ))}
            </select>
          </div>
          <div className="row">
            <div className="col-md-8 mb-3">
              <label htmlFor="primaryLanguage" className="form-label">Lyrics language</label>
              <input name="primaryLanguage" id="primaryLanguage" value={song.primaryLanguage}
                className="form-control" onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="primaryLanguageCode" className="form-label">Language code</label>
              <input name="primaryLanguageCode" id="primaryLanguageCode"
                value={song.primaryLanguageCode} className="form-control" onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            {errors.verses && <p className="error">{errors.verses.message}</p>}

            <label htmlFor="verses" className="form-label">
              Authorized lyrics:
            </label>
            <textarea
              type="text"
              name="verses"
              id="verses"
              value={song.verses}
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="source" className="form-label">
              Source:
            </label>
            <input
              type="text"
              name="source"
              id="source"
              value={song.source}
              className="form-control"
              onChange={handleChange}
              placeholder="EZ-metadata, artist, album booklet, or authorized source"
            />
          </div>
          {errors.general && <div className="alert alert-danger">{errors.general.message}</div>}
          <div className="text-end">
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm;
