import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { handleSearchById, handleDelete } from "../utils/Handler";
import Button from "../ui/Button";
import BackButton from "../ui/BackButton";

function DisplayById() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetchedDataById, setFetchedDataById] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await handleSearchById(id, setFetchedDataById, setErrorMessage);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/event/edit/${fetchedDataById.data.id}`);
  };

  const handleDeleteEvent = async (deleteId) => {
    await handleDelete(deleteId);
    navigate("/event");
  };

  return (
    <div className="output-section">
      <h2>Event by ID</h2>
      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : fetchedDataById ? (
        <div className="data-item">
          <p>
            <strong>ID:</strong> {fetchedDataById.data.id}
          </p>
          <p>
            <strong>Title:</strong> {fetchedDataById.data.title}
          </p>
          <p>
            <strong>Organizers:</strong>{" "}
            {fetchedDataById.data.untaggedOrganizers || ""}
          </p>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(fetchedDataById.data.startDate).toLocaleString()}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(fetchedDataById.data.dueDate).toLocaleString()}
          </p>
          <p>
            <strong>Destination Link:</strong>{" "}
            {fetchedDataById.data.destinationLink && (
              <a href={fetchedDataById.data.destinationLink}>
                {fetchedDataById.data.destinationLink}
              </a>
            )}
          </p>
          <p>
            <strong>Status:</strong> {fetchedDataById.data.status || ""}
          </p>
          <Button variant="warning" onClick={handleEdit}>
            Edit
          </Button>{" "}
          <Button
            variant="danger"
            onClick={() => handleDeleteEvent(fetchedDataById.data.id)}
          >
            Delete
          </Button>
        </div>
      ) : (
        <p>No event found for this ID.</p>
      )}

      {!loading && (
        <>
          {" "}
          <hr />
          <BackButton to="/" text="⬅️ Home" />
        </>
      )}
    </div>
  );
}

export default DisplayById;
