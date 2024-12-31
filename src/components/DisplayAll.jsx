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
    navigate(`/event/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      // Optimistically remove the event from the list
      setFetchedData((prevData) => ({
        ...prevData,
        data: prevData.data.filter((event) => event.id !== id),
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
            data: [...prevData.data, { id }], // Re-add deleted item (this part should match the deleted event)
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
          {fetchedData && fetchedData.data?.length > 0 ? (
            fetchedData.data.map((event) => (
              <div className="data-item" key={event.id}>
                {/* Avatar Section */}
                {event.avatar && (
                  <div className="avatar-section">
                    <img
                      src={event.avatar}
                      alt="Avatar"
                      className="avatar-image"
                    />
                  </div>
                )}
                <p>
                  <strong>ID:</strong> {event.id}
                </p>
                <p>
                  <strong>Title:</strong> {event.title}
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
                    <a href={event.destinationLink}>{event.destinationLink}</a>
                  )}
                </p>
                <p>
                  <strong>Status:</strong> {event.status || ""}
                </p>
                <button onClick={() => handleEdit(event.id)}>Edit</button>
                <button onClick={() => handleDelete(event.id)}>Delete</button>
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
