import SongRow from './SongRow';

function SongsList({ songs, setIsLoaded }) {
  return (
    <div className="manager-card">
      <div className="manager-card-header">
        <span className="editor-step">02</span>
        <div>
          <h2>All songs</h2>
          <p>{songs.length} songs in the collection</p>
        </div>
      </div>
      <div className="manager-table-wrap">
        <table className="table manager-table">
          <thead>
            <tr>
              <th>Song title</th>
              <th>Artist</th>
              <th>Ethiopian genre</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <SongRow key={song._id} song={song} setIsLoaded={setIsLoaded} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default SongsList;
