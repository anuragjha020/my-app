import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to the Event Management</h1>
      <div>
        <Link to="/create-event">
          <button>Create Event</button>
        </Link>
      </div>
      <div>
        <Link to="/event/listEvents">
          <button>View Event</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
