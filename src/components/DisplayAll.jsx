import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  handleFetchAll,
  handleDelete as handleDeleteEvent,
} from "../utils/Handler";
import BackButton from "../ui/BackButton";
import "../styles/DisplayAll.css";

function DisplayAll() {
  const [fetchedData, setFetchedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all events when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await handleFetchAll(setFetchedData, setErrorMessage);
      } catch (error) {
        setErrorMessage("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (id) => {
    const selectedEvent = fetchedData.find((event) => event.id === id);
    navigate(`/create-event/${id}`, { state: { event: selectedEvent } });
  };

  const handleView = (id) => {
    const selectedEvent = fetchedData.find((event) => event.id === id);
    navigate(`/event/${id}`, { state: { event: selectedEvent } });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      // Optimistically remove the event from the list
      setFetchedData((prevData) => ({
        ...prevData,
        data: prevData.filter((event) => event.id !== id),
      }));

      // Proceed with the delete request
      handleDeleteEvent(id)
        .then(() => {
          // Refetch data only if the deletion succeeds
          handleFetchAll(setFetchedData, setErrorMessage);
        })
        .catch((error) => {
          // If delete fails, revert the optimistic update
          alert("Error deleting event: " + error.message);
          setFetchedData((prevData) => ({
            ...prevData,
            data: [...prevData, { id }], // Re-add deleted item (this part should match the deleted event)
          }));
        });
    }
  };

  return (
    <div className="output-section">
      <h2 className="title">All Events</h2>
      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : (
        <div className="displayAll-container">
          {fetchedData && fetchedData?.length > 0 ? (
            fetchedData.map((event) => (
              <div className="data-item" key={event.id}>
                {/* Avatar Section */}
                <div className="avatar-section">
                  <img
                    src={event.avatar === null ? "/avatar.jpeg" : event.avatar}
                    alt="Avatar"
                    className="avatar-image"
                  />
                </div>
                <p>
                  <strong>Title:</strong> {event.title}
                </p>
                <p>
                  <strong>untaggedOrganizers:</strong>{" "}
                  {event.untaggedOrganizers}
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
      )}
      {!loading && <BackButton to="/" text="⬅️ Home" />}
    </div>
  );
}

export default DisplayAll;
