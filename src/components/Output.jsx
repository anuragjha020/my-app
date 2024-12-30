import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import BackButton from "../ui/BackButton";
import "../styles/Output.css";

function Output() {
  const [id, setId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSearchNavigation = () => {
    if (!id) {
      setErrorMessage("Please enter a valid ID.");
      return;
    }
    navigate(`/event/eventId/${id}`);
  };

  const handleDisplayAllNavigation = () => {
    navigate("/event/listEvents");
  };

  return (
    <div className="output-container">
      <div className="search-section">
        <h3>Search & Fetch</h3>
        <div className="search-row">
          <input
            type="text"
            placeholder="Enter ID to search"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="search-input"
          />
          <Button onClick={handleSearchNavigation} variant="primary">
            Display by ID
          </Button>
          <Button onClick={handleDisplayAllNavigation} variant="primary">
            Display All Data
          </Button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <BackButton to="/" text="⬅️ Home" />
    </div>
  );
}

export default Output;
