import React from "react";
import { Link } from "react-router-dom";
import "../styles/PageNotFound.css";

function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <Link to="/" className="go-home">
        Go to Home Page
      </Link>
    </div>
  );
}

export default NotFound;
