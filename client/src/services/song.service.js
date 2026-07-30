import axios from 'axios';
import { withZemaVerseGenre, withZemaVerseGenres } from '../config/genres';

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || ''}/api/songs`,
});

function authConfig(token) {
  if (!token) return {};

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

const SONG_SERVICE = {
  createSong: async (songData) => {
    try {
      const res = await http.post('/', songData);
      return withZemaVerseGenre(res.data);
    } catch (err) {
      throw err;
    }
  },

  getSongById: async (id) => {
    try {
      const res = await http.get(`/${id}`);
      return withZemaVerseGenre(res.data);
    } catch (err) {
      throw err;
    }
  },

  getAllSong: async (token) => {
    try {
      const res = await http.get('/', authConfig(token));
      return withZemaVerseGenres(res.data);
    } catch (err) {
      throw err;
    }
  },

  searchSong: async (searchQuery) => {
    try {
      const res = await http.get(`/search?query=${searchQuery}`);
      console.log('Search Results:', res.data); // Log the entire response array
      if (res.data.length === 0) {
        throw new Error('No ZemaVerse found');
      }
      return withZemaVerseGenre(res.data[0]);
    } catch (err) {
      console.error('Error fetching ZemaVerse:', err);
      throw err;
    }
  },

  updateSongById: async (id, songData, token) => {
    try {
      const res = await http.put(`/${id}`, songData, authConfig(token));
      return withZemaVerseGenre(res.data);
    } catch (err) {
      throw err;
    }
  },

  deleteSongById: async (id) => {
    try {
      const res = await http.delete(`/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};

export default SONG_SERVICE;
