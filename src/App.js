import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyForm from "./components/MyForm";
import Output from "./components/Output";
import Home from "./components/Home";
import PageNotFound from "./components/PageNotFound";
import "./styles/App.css";
import DisplayById from "./components/DisplayById";
import DisplayAll from "./components/DisplayAll";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-event" element={<MyForm />} />
          <Route path="/event" element={<Output />} />
          <Route path="/event/eventId/:id" element={<DisplayById />} />
          <Route path="/event/listEvents" element={<DisplayAll />} />
          <Route path="/event/edit/:id" element={<MyForm />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
