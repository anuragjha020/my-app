import "../styles/EventList.css";

function EventList({
  requiredData,
  loading,
  errorMessage,
  sortOption,
  setSortOption,
  filterOption,
  setFilterOption,
  inputValue,
  handleSearch,
  handleEdit,
  handleDelete,
  handleView,
}) {
  return (
    <div className="output-section">
      <h2 className="title">All Events</h2>
      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : (
        <>
          <div className="sort-filter-search-container">
            {/* Sorting */}
            <select
              className="sort-container option-container"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="id_asc">ID (0 - 9)</option>
              <option value="id_desc">ID (9 - 0)</option>
              <option value="title">Title</option>
              <option value="startDate">Start Date</option>
              <option value="dueDate">Due Date</option>
            </select>

            {/* Filtering */}
            <select
              className="filter-container option-container"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="">Filter by status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>

            {/* Searching */}
            <input
              type="text"
              placeholder="Search by title"
              className="search-container"
              value={inputValue}
              onChange={handleSearch}
            />
          </div>

          <div className="displayAll-container">
            {requiredData && requiredData.length > 0 ? (
              requiredData.map((event) => (
                <div className="data-item" key={event.id}>
                  {/* Avatar Section */}
                  <div className="avatar-section">
                    <img
                      src={
                        event.avatar === null ? "/avatar.jpeg" : event.avatar
                      }
                      alt="Avatar"
                      className="avatar-image"
                    />
                  </div>
                  <p>
                    <strong>Title:</strong> {event.title}
                  </p>
                  <p>
                    <strong>Organizers:</strong> {event.untaggedOrganizers}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(event.startDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {new Date(event.dueDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Destination Link:</strong>{" "}
                    {event.destinationLink && (
                      <a href={event.destinationLink}>
                        {event.destinationLink}
                      </a>
                    )}
                  </p>
                  <p>
                    <strong>Status:</strong> {event.status || ""}
                  </p>
                  <button onClick={() => handleEdit(event.id)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(event.id)}>Delete</button>{" "}
                  <button onClick={() => handleView(event.id)}>View</button>
                  <hr />
                </div>
              ))
            ) : (
              <p>No events found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default EventList;
