import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  handleFetchAll,
  handleDelete as handleDeleteEvent,
} from "../utils/Handler";
import BackButton from "../ui/BackButton";
import EventList from "./EventList";
import Pagination from "./Pagination";
import { Create, Event, home } from "../variables/const";
import useDebouncedValue from "../hooks/useDebouncedValue";
import useProcessFetchedData from "../hooks/useProcessFetchedData";

function DisplayAll() {
  // States ===========================
  const [fetchedData, setFetchedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");

  // Debouncing search input
  const debouncedSearch = useDebouncedValue(inputValue, 500);

  const eventsPerPage = 4;
  const navigate = useNavigate();

  // Fetching all data in the beginning
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

  // Using the custom hook to process data
  const processedData = useProcessFetchedData(
    fetchedData,
    filterOption,
    debouncedSearch,
    sortOption
  );

  // Pagination ========================
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = processedData?.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  // Edit event ========================
  const handleEdit = (id) => {
    const selectedEvent = fetchedData.find((event) => event.id === id);
    navigate(`${Create}/${id}`, { state: { event: selectedEvent } });
  };

  // View single event ========================
  const handleView = (id) => {
    const selectedEvent = fetchedData.find((event) => event.id === id);
    navigate(`${Event}/${id}`, { state: { event: selectedEvent } });
  };

  // Delete single event ========================
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setFetchedData((prevData) => prevData.filter((event) => event.id !== id));
      handleDeleteEvent(id)
        .then(() => {
          handleFetchAll(setFetchedData, setErrorMessage);
        })
        .catch((error) => {
          alert("Error deleting event: " + error.message);
        });
    }
  };

  return (
    <div>
      <EventList
        requiredData={currentEvents}
        loading={loading}
        errorMessage={errorMessage}
        sortOption={sortOption}
        setSortOption={setSortOption}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
        inputValue={inputValue}
        handleSearch={(e) => setInputValue(e.target.value)}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleView={handleView}
      />
      <Pagination
        totalPages={Math.ceil((processedData?.length || 0) / eventsPerPage)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {!loading && <BackButton to={home} text="⬅️ Home" />}
    </div>
  );
}

export default DisplayAll;
