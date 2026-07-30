import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:8004/api/songs',
});

const SONG_SERVICE = {
  createSong: async (songData) => {
    try {
      const res = await http.post('/', songData);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  getSongById: async (id) => {
    try {
      const res = await http.get(`/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  getAllSong: async () => {
    try {
      const res = await http.get('/');
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  searchSong: async (searchQuery) => {
    try {
      const res = await http.get(`/search?query=${searchQuery}`);
      console.log('Search Results:', res.data); // Log the entire response array
      if (res.data.length === 0) {
        throw new Error('No songs found');
      }
      return res.data[0];
    } catch (err) {
      console.error('Error fetching song:', err);
      throw err;
    }
  },

  updateSongById: async (id, songData) => {
    try {
      const res = await http.put(`/${songData._id}`, songData);
      return res.data;
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
