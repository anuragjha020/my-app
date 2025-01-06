import { Link } from "react-router-dom";
import "../styles/Home.css";
import { Create, EventList } from "../variables/const";

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to the Event Management</h1>
      <div>
        <Link to={Create}>
          <button>Create Event</button>
        </Link>
      </div>
      <div>
        <Link to={EventList}>
          <button>View Event</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
