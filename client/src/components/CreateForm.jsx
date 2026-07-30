import { useContext, useEffect, useState } from 'react';
import SONG_SERVICE from '../services/song.service';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ZEMAVERSE_GENRES } from '../config/genres';

const CreateForm = ({ setIsLoaded }) => {
  const { state } = useContext(AuthContext);
  const initialSong = {
    songName: '',
    artistName: '',
    source: '',
    verses: '',
    primaryLanguage: 'Amharic',
    primaryLanguageCode: 'am',
    translationLanguage: 'English',
    translationLanguageCode: 'en',
    translationText: '',
    genre: ZEMAVERSE_GENRES[0],
    createdBy: state.user?.id,
  };

  const navigate = useNavigate();
  const [song, setSong] = useState(initialSong);
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!state.user) {
      navigate('/songs');
    }
  }, [state.user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSong((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const lyrics = [{
        language: song.primaryLanguage,
        languageCode: song.primaryLanguageCode,
        title: song.songName,
        text: song.verses,
      }];
      if (song.translationText.trim()) {
        lyrics.push({
          language: song.translationLanguage,
          languageCode: song.translationLanguageCode,
          title: song.songName,
          text: song.translationText,
        });
      }
      const { translationLanguage, translationLanguageCode, translationText, ...payload } = song;
      await SONG_SERVICE.createSong({ ...payload, lyrics });
      setSong(initialSong);
      setValidated(false);
      setSuccessMessage('ZemaVerse added to the library.');
      setIsLoaded(false);
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="editor-card">
      <div className="editor-card-header">
        <span className="editor-step">01</span>
        <div>
          <h2>Add lyrics</h2>
          <p>Publish Amharic, English, or any language—and optionally add a translation.</p>
        </div>
      </div>
      <div className="editor-card-body">
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
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
              required
              minLength={2}
            />
            <div className="invalid-feedback">Enter a song title of at least two characters.</div>
          </div>
          <div className="row">
            <div className="col-md-8 mb-3">
              <label htmlFor="primaryLanguage" className="form-label">Lyrics language *</label>
              <input id="primaryLanguage" name="primaryLanguage" value={song.primaryLanguage}
                className="form-control" onChange={handleChange} required placeholder="Amharic" />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="primaryLanguageCode" className="form-label">Language code *</label>
              <input id="primaryLanguageCode" name="primaryLanguageCode"
                value={song.primaryLanguageCode} className="form-control"
                onChange={handleChange} required placeholder="am" />
            </div>
          </div>

          <div className="mb-3">
            {errors.artistName && (
              <p className="error">{errors.artistName.message}</p>
            )}
            <label htmlFor="artistName" className="form-label">
              Artist name
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
              required
            >
              {ZEMAVERSE_GENRES.map((genreType) => (
                <option key={genreType} value={genreType}>
                  {genreType}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            {errors.source && (
              <p className="error">{errors.source.message}</p>
            )}
            <label htmlFor="source" className="form-label">
              Source attribution
            </label>
            <input
              type="text"
              name="source"
              id="source"
              className="form-control"
              value={song.source}
              onChange={handleChange}
              placeholder="Artist, album booklet, website, or other authorized source"
            />
          </div>

          <div className="mb-3">
            {errors.verses && <p className="error">{errors.verses.message}</p>}

            <label htmlFor="verses" className="form-label">
              Lyrics *
            </label>
            <textarea
              type="text"
              name="verses"
              id="verses"
              value={song.verses}
              className="form-control"
              onChange={handleChange}
              required
              rows={9}
            />
            <div className="invalid-feedback">Enter the lyrics in the selected language.</div>
          </div>
          <div className="translation-panel mb-3">
            <h3>Optional translation</h3>
            <div className="row">
              <div className="col-md-8 mb-3">
                <label htmlFor="translationLanguage" className="form-label">Translation language</label>
                <input id="translationLanguage" name="translationLanguage"
                  value={song.translationLanguage} className="form-control"
                  onChange={handleChange} placeholder="English" />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="translationLanguageCode" className="form-label">Language code</label>
                <input id="translationLanguageCode" name="translationLanguageCode"
                  value={song.translationLanguageCode} className="form-control"
                  onChange={handleChange} placeholder="en" />
              </div>
            </div>
            <label htmlFor="translationText" className="form-label">Translated lyrics</label>
            <textarea id="translationText" name="translationText"
              value={song.translationText} className="form-control"
              onChange={handleChange} rows={7} />
          </div>
          <div className="editor-actions">
            <span>Your song will receive the next ZM# automatically.</span>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding ZemaVerse…' : 'Add to library'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateForm;
