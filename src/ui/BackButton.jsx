import { Link } from "react-router-dom";
import "../styles/BackButton.css";

function BackButton({ to, text }) {
  return (
    <div className="bach-btn-container">
      <Link to={to}>
        <button className="back-btn">{text}</button>
      </Link>
    </div>
  );
}

export default BackButton;
