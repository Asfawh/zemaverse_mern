/* React */
import { useContext, useEffect, useMemo, useState } from 'react';

/* react-router */
import { Link, useSearchParams } from 'react-router-dom';

/* local */
import { AuthContext } from '../context/AuthContext';
import EachSong from '../components/EachSong';
import styles from '../css/song-list.module.css';
import SONG_SERVICE from '../services/song.service';
import REACTION_SERVICE from '../services/reaction.service';
import { getDisplayedZemaVerseSource } from '../config/zemaverse';

const featuredArtists = [
  {
    name: 'Teddy Afro', amharic: 'ቴዲ አፍሮ', image: '/assets/teddy-afro.jpg', era: 'Modern icon',
    artistAliases: ['Tewodros Kassahun', 'Tewodros Kassahun (Teddy Afro)'],
    born: '1976 · Addis Ababa', active: '2001–present', genres: 'Ethiopian music · Reggae fusion',
    knownFor: 'Abugida · Tikur Sew · Ethiopia',
    bio: 'Tewodros Kassahun, known as Teddy Afro, blends traditional Ethiopian sounds, reggae, and socially engaged songwriting. His albums and large public concerts have made him one of Ethiopia’s most influential contemporary performers.',
    wiki: 'https://en.wikipedia.org/wiki/Teddy_Afro',
  },
  {
    name: 'Aster Aweke', amharic: 'አስቴር አወቀ', image: '/assets/aster-aweke.jpg', era: 'Legendary voice',
    born: '1959 · Gondar', active: '1970s–present', genres: 'Ethiopian music · Ethio-jazz · Soul-jazz',
    knownFor: 'Hagere · Fikir · Abebayehosh',
    bio: 'Aster Aweke is celebrated for her powerful voice and expressive Amharic performances. After beginning in Addis Ababa’s music scene, she built an international career and became a defining voice for Ethiopian audiences at home and abroad.',
    wiki: 'https://en.wikipedia.org/wiki/Aster_Aweke',
  },
  {
    name: 'Mahmoud Ahmed', amharic: 'መሐሙድ አህመድ', image: '/assets/mahmoud-ahmed.jpg', era: 'Golden age',
    born: '1941 · Addis Ababa', active: '1960s–present', genres: 'Ethiopian music · Ethio-jazz · World music',
    knownFor: 'Ere Mela Mela · Tizita · Soul of Addis',
    bio: 'Mahmoud Ahmed rose from Addis Ababa’s Mercato district to the Imperial Bodyguard Band and the center of Ethiopia’s golden-age sound. His intensely emotional style helped introduce modern Ethiopian music to international audiences.',
    wiki: 'https://en.wikipedia.org/wiki/Mahmoud_Ahmed',
  },
  {
    name: 'Tilahun Gessesse', amharic: 'ጥላሁን ገሠሠ', image: '/assets/tilahun-gessesse.jpg', era: 'The Voice',
    born: '1940 · Addis Ababa', active: '1950s–2009', genres: 'Ethiopian popular music · Tizita',
    knownFor: 'Ethiopia · Tizita classics · Theatre and radio',
    bio: 'Tilahun Gessesse was a towering figure in Ethiopian popular music whose recordings spanned more than half a century. Known for his resonant voice and emotional phrasing, he remains a foundational influence across generations.',
    wiki: 'https://en.wikipedia.org/wiki/Tilahun_Gessesse',
  },
  {
    name: 'Alemayehu Eshete', amharic: 'አለማየሁ እሸቴ', image: '/assets/alemayehu-eshete.jpg', era: 'Ethio-jazz pioneer',
    born: '1941 · Jimma', active: '1960s–2021', genres: 'Ethio-jazz · Soul · Funk',
    knownFor: 'Addis Ababa Bete · Temar Lije · Éthiopiques',
    bio: 'Alemayehu Eshete brought explosive stage energy and soul-inflected vocals to Ethiopia’s 1960s and 1970s music revolution. Often associated with Ethio-jazz’s golden era, his recordings later reached a broad global audience.',
    wiki: 'https://en.wikipedia.org/wiki/Alemayehu_Eshete',
  },
  {
    name: 'Hachalu Hundessa', amharic: 'ሀጫሉ ሁንዴሳ', image: '/assets/hachalu-hundessa.jpg', era: 'Oromo voice',
    born: '1986 · Ambo', active: '2009–2020', genres: 'Oromo music · Protest song',
    knownFor: 'Maal Mallisaa · Jirraa · Sanyii Mootii',
    bio: 'Hachalu Hundessa was an Oromo singer-songwriter whose music addressed identity, dignity, and social justice. His songs became deeply important to a generation of Oromo listeners and remain central to his cultural legacy.',
    wiki: 'https://en.wikipedia.org/wiki/Hachalu_Hundessa',
  },
  {
    name: 'Eyob Mekonnen', amharic: 'እዮብ መኮንን', image: '/assets/eyob-mekonnen.jpg', era: 'Ethiopian reggae pioneer',
    born: '1975 · Jijiga', active: '2000–2013', genres: 'Reggae · Roots · Ethiopian music',
    knownFor: 'Ende Kal · Negen Layew · Erotalehu',
    bio: 'Eyob Mekonnen helped establish a distinctly Ethiopian reggae sound, bringing Amharic and Oromo musical influences into roots reggae. His songs emphasized peace, love, understanding, respect, and social awareness.',
    wiki: 'https://en.wikipedia.org/wiki/Eyob_Mekonnen',
  },
  {
    name: 'Ephrem Tamiru', amharic: 'ኤፍሬም ታምሩ', image: '/assets/ephrem-tamiru.png',
    imagePosition: '22% center', era: 'Veteran vocalist',
    born: 'Ethiopia', active: 'Multi-decade career', genres: 'Ethiopian popular music · Amharic',
    knownFor: 'Amharic classics · Expressive vocal performance',
    bio: 'Ephrem Tamiru is a long-standing Ethiopian vocalist whose recordings are recognized across generations. His expressive style holds an important place in Amharic popular music.',
    wiki: 'https://en.wikipedia.org/wiki/Culture_of_Ethiopia#Music',
    linkLabel: 'View Ethiopian music context on Wikipedia',
  },
  {
    name: 'Solomon Haile', amharic: 'ሰሎሞን ኃይሌ', image: '/assets/solomon-haile.png',
    imagePosition: '68% center', era: 'Tigrinya artist',
    born: 'Ethiopia', active: 'Contemporary era', genres: 'Tigrinya music · Ethiopian music',
    knownFor: 'Gobez · Aronay',
    bio: 'Solomon Haile is an Ethiopian Tigrinya singer whose contemporary recordings carry Tigrayan melodic traditions into modern arrangements.',
    wiki: 'https://en.wikipedia.org/wiki/Tigrayans#Music',
    linkLabel: 'View Tigrinya music context on Wikipedia',
  },
  {
    name: 'Abraham Gebremedhin', amharic: 'አብርሃም ገብረመድኅን', image: '/assets/abraham-gebremedhin.jpg', era: 'Tigrinya music star',
    born: 'Ethiopia', active: 'Contemporary era', genres: 'Tigrinya music · Ethiopian pop',
    knownFor: 'Habeney · Mesanytey · Ethiopia Hagere',
    bio: 'Abraham Gebremedhin, also known as Abrish, is an Ethiopian Tigrinya artist whose albums combine a strong regional musical identity with contemporary arrangements.',
    wiki: 'https://www.musicinafrica.net/fr/node/8853',
    linkLabel: 'Read the Music In Africa profile',
  },
  {
    name: 'Ephrem Amare', amharic: 'ኤፍሬም አማረ', image: '/assets/ephrem-amare.png', era: 'Tigrinya artist',
    born: 'Ethiopia', active: 'Contemporary era', genres: 'Tigrinya music · Ethiopian music',
    knownFor: 'Modern Tigrinya repertoire',
    bio: 'Ephrem Amare is a contemporary Ethiopian artist associated with modern Tigrinya music and its continuing presence in Ethiopia’s popular-music landscape.',
    wiki: 'https://en.wikipedia.org/wiki/Tigrayans#Music',
    linkLabel: 'View Tigrinya music context on Wikipedia',
  },
  {
    name: 'Neway Debebe', amharic: 'ነዋይ ደበበ', image: '/assets/neway-debebe.jpeg', era: 'Voice of silk',
    born: '1958 · Hamer Bako', active: '1977–present',
    genres: 'Ethiopian music · Ethio-jazz · Afro-pop · Reggae',
    knownFor: 'Maebel Naw · Hageren Alresam · Yetikimt Abeba',
    bio: 'Neway Debebe is an Ethiopian singer-songwriter whose smooth, wide-ranging voice has moved between traditional Ethiopian rhythms, ethno-jazz, rumba, reggae, calypso, and Afro-pop. After early work with theatre ensembles and the Roha Band, he built a multi-decade solo career and also composed for fellow artists.',
    wiki: 'https://en.wikipedia.org/wiki/Neway_Debebe',
  },
  {
    name: 'Tewodros Tadesse', amharic: 'ቴዎድሮስ ታደሰ', image: '/assets/tewodros-tadesse.jpeg',
    era: 'Melodic soul', born: 'Addis Ababa', active: '1980s–present',
    genres: 'Ethiopian popular music · Amharic ballad',
    knownFor: 'Lubanjaye · Eyekorekoregn · Sadulaye · Emye Ethiopia',
    bio: 'Tewodros Tadesse is a veteran Ethiopian vocalist known for a mellow, emotionally resonant style shaped in part by early church singing. His breakthrough album Lubanjaye established him as a household name, followed by enduring releases including Eyekorekoregn and Sadulaye.',
    wiki: 'https://www.ethiosports.com/2014/09/21/music-is-my-life-tewodros-tadesse/',
    linkLabel: 'Read the artist interview and profile',
  },
  {
    name: 'Tsegaye Eshetu', amharic: 'ፀጋዬ እሸቱ', image: '/assets/tsegaye-eshetu.jpeg',
    era: 'Axumite Band veteran', born: 'Ethiopia', active: '1980s–present',
    genres: 'Traditional Ethiopian music · Modern Ethiopian music',
    knownFor: 'Tekelekelalu · Gellel Bey · Abay Negade',
    bio: 'Tsegaye Eshetu is an Ethiopian singer whose repertoire joins traditional and modern styles. Closely associated with the Axumite Band, he has sustained a catalogue of popular recordings and performances since the 1980s.',
    wiki: 'https://tsegayeeshetu.com/',
    linkLabel: 'Visit the official artist profile',
  },
  {
    name: 'Tamrat Desta', amharic: 'ታምራት ደስታ', image: '/assets/tamrat-desta.jpg',
    artistAliases: ['Tamirat Desta'],
    era: 'Modern balladeer', born: '1978 · Tiqur Wuha', active: '1998–2018',
    genres: 'Ethiopian music · Amharic pop',
    knownFor: 'Anleyaym · Kanchi Ayebeltm',
    bio: 'Tamrat Desta was an Ethiopian singer-songwriter whose heartfelt melodies and romantic Amharic lyrics made him a major voice of the 2000s. His albums Anleyaym and Kanchi Ayebeltm remain central to his musical legacy.',
    wiki: 'https://en.wikipedia.org/wiki/Tamrat_Desta',
  },
  {
    name: 'Abdu Kiar', amharic: 'አብዱ ኪያር', image: '/assets/abdu-kiar.jpeg', era: 'Merkato storyteller',
    born: '1976 · Addis Merkato', active: '1997–present',
    genres: 'Ethiopian music · Reggae · Dancehall · Hip-hop',
    knownFor: 'Merkato Sefere · Fikir Beamarigna · Minew Shewa',
    bio: 'Abdu Kiar is an Ethiopian singer-songwriter raised in Addis Ababa’s Merkato district. After performing reggae, dancehall, and hip-hop with the Express band, his 2003 debut Merkato Sefere brought him national recognition for contemporary arrangements and memorable Amharic lyrics.',
    wiki: 'https://www.musicinafrica.net/node/6365',
    linkLabel: 'Read the Music In Africa profile',
  },
  {
    name: 'Gigi (Ejigayehu Shibabaw)', amharic: 'ጂጂ · እጅጋየሁ ሽባባው',
    artistAliases: ['Gigi', 'Ejigayehu Shibabaw', 'Gigi Shibabaw'],
    image: '/assets/gigi-ejigayehu-shibabaw.jpeg', era: 'Global Ethiopian voice',
    born: '1974 · Chagni', active: '1997–present',
    genres: 'Ethiopian music · World · Trip-hop · Jazz fusion',
    knownFor: 'Gigi · Guramayle · Abyssinia Infinite · Gold & Wax',
    bio: 'Ejigayehu Shibabaw, known internationally as Gigi, carries Ethiopian melodic traditions into jazz, dub, trip-hop, and world-music collaborations. Her internationally acclaimed recordings brought Amharic vocals and Ethiopian musical ideas to a broad global audience.',
    wiki: 'https://en.wikipedia.org/wiki/Gigi_(singer)',
  },
  {
    name: 'Zeritu Kebede', amharic: 'ዘሪቱ ከበደ', image: '/assets/zeritu-kebede.jpg', era: 'Singer-songwriter',
    born: '1984 · Addis Ababa', active: '2005–present', genres: 'Ethio-Pop · Acoustic · Gospel',
    knownFor: 'Zeritu · Artificial · Eza Alkerehum',
    bio: 'Zeritu Kebede is an Ethiopian singer-songwriter, actress, and screenwriter whose debut album established her as a major modern voice. Her work brings personal songwriting together with pop, acoustic, and spiritual influences.',
    wiki: 'https://en.wikipedia.org/wiki/Zeritu_Kebede',
  },
];

function normalizeArtistName(value = '') {
  return value
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}\s]+/gu, '');
}

function ArtistPortrait({ artist, className = '' }) {
  if (artist.image) {
    return (
      <img className={className} src={artist.image} alt={`${artist.name}, Ethiopian singer`}
        style={artist.imagePosition ? { objectPosition: artist.imagePosition } : undefined} />
    );
  }

  return (
    <div className={`artist-portrait-placeholder ${className}`.trim()} role="img"
      aria-label={`${artist.name}, portrait placeholder`}>
      <span aria-hidden="true">{artist.initials}</span>
    </div>
  );
}

function MainList() {
  const [songs, setSongs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reactionError, setReactionError] = useState('');
  const [busySongId, setBusySongId] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('query') || '');
  const {
    state: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    let active = true;
    setIsLoaded(false);

    SONG_SERVICE.getAllSong(user?.token)
      .then((res) => {
        if (!active) return;
        setSongs(res);
        setIsLoaded(true);
        setLoadError('');
      })
      .catch(() => {
        if (!active) return;
        setLoadError('The song library could not be loaded. Please try again.');
        setIsLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [user?.token]);

  const query = searchParams.get('query')?.trim().toLowerCase() || '';
  const visibleSongs = useMemo(() => songs.filter((song) => {
    if (!query) return true;
    return [
      song.songName,
      song.artistName,
      song.genre,
      getDisplayedZemaVerseSource(song),
      song.verses,
      ...(song.lyrics || []).flatMap((version) => [
        version.language,
        version.languageCode,
        version.title,
        version.text,
      ]),
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  }), [songs, query]);

  const selectedArtistSongs = useMemo(() => {
    if (!selectedArtist) return [];

    const artistNames = [selectedArtist.name, ...(selectedArtist.artistAliases || [])]
      .map(normalizeArtistName);

    return songs
      .filter((song) => artistNames.includes(normalizeArtistName(song.artistName)))
      .sort((first, second) => (first.songName || '').localeCompare(
        second.songName || '',
        ['am', 'en'],
        { sensitivity: 'base' }
      ));
  }, [selectedArtist, songs]);

  useEffect(() => {
    setSearchValue(searchParams.get('query') || '');
  }, [searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = searchValue.trim();
    setSearchParams(value ? { query: value } : {});
  };

  const clearSearch = () => {
    setSearchValue('');
    setSearchParams({});
  };

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

      setSongs((current) => current.map((item) => (
        item._id === song._id ? updatedSong : item
      )));
    } catch {
      setReactionError('Your reaction could not be saved. Please try again.');
    } finally {
      setBusySongId(null);
    }
  };

  let subtitle = 'Login or register for more.';

  if (user) {
    subtitle = 'Explore the collection, open a song for its lyrics, or add a new one.';
  }

  return (
    <>
      <section className="hero-section" aria-label="Ethiopian music lyrics library">
        <div className="hero-copy">
          <span className="eyebrow">The sound of Ethiopia</span>
          <h1>Every voice.<br /><em>Every lyric.</em></h1>
          <p className="hero-description">
            Explore the words behind Ethiopia’s most memorable music—from golden-age legends
            to today’s defining voices.
            <span className="hero-amharic">
              የኢትዮጵያን ታዋቂ ድምፆች እና የማይረሱ የዘፈን ግጥሞች በአንድ ቦታ።
            </span>
          </p>
          <form className="hero-search" role="search" onSubmit={handleSearch}>
            <input type="search" value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search a song, artist, or lyric…" aria-label="Search lyrics" />
            <button type="submit">Explore lyrics</button>
          </form>
          <p className="hero-account-note">{subtitle}</p>
          <div className="hero-stats" aria-label="Library summary">
            <span><strong>{songs.length}</strong> lyrics</span>
            <span><strong>{featuredArtists.length}</strong> featured icons</span>
            <span><strong>∞</strong> languages</span>
          </div>
        </div>
        <div className="hero-artist-mosaic" aria-label="Featured Ethiopian singers">
          {featuredArtists.slice(0, 4).map((artist) => (
            <figure key={artist.name}>
              <ArtistPortrait artist={artist} />
              <figcaption>{artist.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="artists-section" aria-labelledby="artists-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Voices that shaped a nation</span>
            <h2 id="artists-heading">Featured Ethiopian artists</h2>
          </div>
          <span className="results-label">Across generations</span>
        </div>
        <div className="artist-grid">
          {featuredArtists.map((artist) => (
            <button className="artist-card" key={artist.name} type="button"
              onClick={() => setSelectedArtist(artist)}
              aria-label={`Read about ${artist.name}`}>
              <ArtistPortrait artist={artist} />
              <div>
                <span>{artist.era}</span>
                <h3>{artist.name}</h3>
                <p>{artist.amharic}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="photo-credit">
          Photos: Teddy Afro and Aster Aweke by Bef 2011; Mahmoud Ahmed by Phil Pasquini;
          Tilahun Gessesse via Ethiopian Broadcasting Corporation; Alemayehu Eshete by Schorle;
          Hachalu Hundessa by OMN;
          Zeritu Kebede by AddisAssefa. Neway Debebe, Tewodros Tadesse, Tsegaye Eshetu,
          Tamrat Desta, Abdu Kiar, and Gigi portraits supplied by the ZemaVerse curator.
          Additional artist imagery is sourced from Music In Africa, Spotify, Apple Music,
          and EphremTube artist profiles.
          Wikimedia Commons photographs are used under their listed licenses.
        </p>
      </section>

      {selectedArtist && (
        <div className="artist-modal-backdrop" role="presentation"
          onClick={() => setSelectedArtist(null)}>
          <article className="artist-wiki-card" role="dialog" aria-modal="true"
            aria-labelledby="artist-dialog-title" onClick={(event) => event.stopPropagation()}>
            <button className="artist-modal-close" type="button"
              onClick={() => setSelectedArtist(null)} aria-label="Close artist details">×</button>
            <ArtistPortrait artist={selectedArtist} className="artist-wiki-portrait" />
            <div className="artist-wiki-content">
              <span className="eyebrow">{selectedArtist.era}</span>
              <h2 id="artist-dialog-title">{selectedArtist.name}</h2>
              <p className="artist-wiki-amharic">{selectedArtist.amharic}</p>
              <dl>
                <div><dt>Born</dt><dd>{selectedArtist.born}</dd></div>
                <div><dt>Career</dt><dd>{selectedArtist.active}</dd></div>
                <div><dt>Sound</dt><dd>{selectedArtist.genres}</dd></div>
                <div><dt>Known for</dt><dd>{selectedArtist.knownFor}</dd></div>
              </dl>
              <p>{selectedArtist.bio}</p>
              {selectedArtistSongs.length > 0 && (
                <section className="artist-wiki-lyrics" aria-labelledby="artist-lyrics-heading">
                  <div className="artist-wiki-lyrics-heading">
                    <h3 id="artist-lyrics-heading">Lyrics by {selectedArtist.name}</h3>
                    <span>{selectedArtistSongs.length}</span>
                  </div>
                  <ol>
                    {selectedArtistSongs.map((song) => (
                      <li key={song._id}>
                        <Link to={`/songs/${song._id}`}>
                          <span>{song.songName}</span>
                          {song.pageNumber && <small>ZM#{song.pageNumber}</small>}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
              <a href={selectedArtist.wiki} target="_blank" rel="noreferrer">
                {selectedArtist.linkLabel || 'Read the full Wikipedia article'} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        </div>
      )}

      <section className="library-section" aria-labelledby="library-heading">
        <div className="section-heading">
          <div className="section-heading-copy">
            <span className="section-heading-icon" aria-hidden="true">♫</span>
            <div>
              <span className="eyebrow">Browse the collection</span>
              <h2 id="library-heading">Lyrics library</h2>
            </div>
          </div>
          <span className="results-label">
            {visibleSongs.length} songs
          </span>
        </div>

        <form className="library-search" role="search" onSubmit={handleSearch}>
          <span className="library-search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search title, artist, genre, source, or lyrics…"
            aria-label="Search the song library"
          />
          {query && (
            <button type="button" className="library-search-clear" onClick={clearSearch}>
              Clear
            </button>
          )}
          <button type="submit" className="library-search-submit">Search</button>
        </form>
        {query && (
          <p className="search-summary">
            Showing results for <strong>“{searchParams.get('query')}”</strong>
          </p>
        )}

        {reactionError && <div className="alert alert-danger">{reactionError}</div>}
        {!isLoaded && <div className="empty-state">Loading the song library…</div>}
        {loadError && <div className="alert alert-danger">{loadError}</div>}
        {isLoaded && !loadError && visibleSongs.length === 0 && (
          <div className="empty-state">
            <strong>No ZemaVerse found.</strong>
            <span>Try another title, artist, or genre.</span>
          </div>
        )}
        <div className={styles.grid}>
          {visibleSongs.map((song) => (
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
    </>
  );
}

export default MainList;
