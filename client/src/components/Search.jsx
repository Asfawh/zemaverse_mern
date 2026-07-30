import { useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// import SearchResults from './SearchResult';

const Search = () => {
  const [query, setQuery] = useState('');

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const value = query.trim();
    navigate(value ? `/songs?query=${encodeURIComponent(value)}` : '/songs');
  };

  // const handleQueryChange = (e) => {
  //   setQuery(e.target.value);
  //   setSearchSubmitted(false); // Reset search when query changes
  // };

  return (
    <Form
      onSubmit={handleSearch}
      className="nav-search"
      role="search"
    >
      <FormControl
        type="text"
        name="search"
        placeholder="Search songs or artists"
        className="nav-search-input"
        value={query}
        aria-label="Search songs and artists"
        onChange={(e) => setQuery(e.target.value)}
      />

      <button type="submit" className="nav-search-button" aria-label="Search">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M11.618 9.897l4.224 4.212c.092.09.1.23.02.312l-1.464 1.46c-.08.08-.222.072-.314-.02L9.868 11.66M6.486 10.9c-2.42 0-4.38-1.955-4.38-4.367 0-2.413 1.96-4.37 4.38-4.37s4.38 1.957 4.38 4.37c0 2.412-1.96 4.368-4.38 4.368m0-10.834C2.904.066 0 2.96 0 6.533 0 10.105 2.904 13 6.486 13s6.487-2.895 6.487-6.467c0-3.572-2.905-6.467-6.487-6.467 "></path>
        </svg>
      </button>
    </Form>
  );
};

export default Search;
