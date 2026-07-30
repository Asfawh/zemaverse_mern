import React from 'react';
import { useState, useEffect, Fragment } from 'react';

// import { useNavigate, Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Figure from 'react-bootstrap/Figure';
import styles from '../css/song-list.module.css';

import SONG_SERVICE from '../services/song.service';

const SearchResults = ({ query }) => {
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(false); // New state for loading
  const [errors, setErrors] = useState(null);
  // console.log(songData);

  console.log(query);
  useEffect(() => {
    if (query) {
      setLoading(true); // Set loading to true when query changes

      SONG_SERVICE.searchSong(query)
        .then((res) => {
          console.log('Song data received:', res); // Log the song data here

          setSongData(res);
          setLoading(false); // Turn off loading after data is set
        })
        .catch((err) => {
          console.error('Error in search:', err);
          setErrors('No ZemaVerse found');
          setLoading(false); // Stop loading on error as well
        });
    }
  }, [query]);

  console.log(errors);

  // If it's still loading
  if (loading) {
    return <p className="text-center mt-3">Loading ZemaVerse...</p>;
  }
  // If an error occurred
  if (errors) {
    return <p className="text-center mt-3">{errors}</p>;
  }

  // If no song data was found
  if (!songData || Object.keys(songData).length === 0) {
    return (
      <p className="text-center mt-3">
        No ZemaVerse found for the query "{query}".
      </p>
    );
  }

  return (
    <Fragment>
      <div className="text-end">
        <Link to={`/songs/`} className="btn btn-primary">
          Home
        </Link>
      </div>

      <p className="text-center mt-3">
        <strong>{songData.songName}</strong>
      </p>

      {songData && (
        <div className="row">
          <Card bg="light" text="dark" className="shadow col">
            <Card.Body>
              <img
                className={styles.img}
                src={songData.image}
                alt={songData.songName}
                // className="img-fluid mb-3"
              />
              <Figure className="ms-5">
                <p className="mb-3">
                  <strong>Length:</strong> {songData.length} Miles
                </p>
                <p className="mb-3">
                  <strong>Elevation:</strong> {songData.elevation} feet
                </p>
                <p className="mb-3">
                  <strong>Location:</strong> {songData.location}
                </p>
                <p className="mb-3">
                  <strong> Difficulty Level:</strong> {songData.difficulty}
                </p>
                <p className="mb-3">
                  <strong>Description:</strong> {songData.description}
                </p>
              </Figure>
            </Card.Body>
          </Card>
        </div>
      )}
    </Fragment>
  );
};

export default SearchResults;
