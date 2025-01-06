import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleDelete } from "../utils/Handler";

import Button from "../ui/Button";
import BackButton from "../ui/BackButton";
import { Create, EventList, home } from "../variables/const";

function DisplayById() {
  const location = useLocation();
  const { event } = location.state || {};
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`${Create}/${event.id}`);
  };

  const handleDeleteEvent = async (deleteId) => {
    await handleDelete(deleteId);
    navigate(`${EventList}`);
  };

  return (
    <div className="output-section">
      <h2 className="title">Event Details</h2>
      {event ? (
        <div className="data-item">
          {/* Avatar Section */}
          <div className="avatar-section">
            <img
              src={event.avatar === null ? "/avatar.jpeg" : event.avatar}
              alt="Avatar"
              className="avatar-image"
            />
          </div>
          {/* Event Details */}
          <p>
            <strong>ID:</strong> {event.id}
          </p>
          <p>
            <strong>Title:</strong> {event.title}
          </p>
          <p>
            <strong>Organizers:</strong> {event.untaggedOrganizers || ""}
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
          {/* Buttons */}
          <Button variant="warning" onClick={handleEdit}>
            Edit
          </Button>{" "}
          <Button variant="danger" onClick={() => handleDeleteEvent(event.id)}>
            Delete
          </Button>
        </div>
      ) : (
        <p>No event found for this ID.</p>
      )}{" "}
      <hr />
      <BackButton to={home} text="⬅️ Home" />
    </div>
  );
}

export default DisplayById;
