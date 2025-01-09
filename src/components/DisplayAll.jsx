import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  handleFetchAll,
  handleDelete as handleDeleteEvent,
} from "../utils/Handler";
import BackButton from "../ui/BackButton";
import EventList from "./EventList";
import Pagination from "./Pagination";
import { API_ENDPOINTS, Create, Event, home } from "../variables/const";

async function processFetchedData(
  fetchedData,
  filterOption,
  inputValue,
  sortOption,
  signal
) {
  let updatedData = [...fetchedData];

  // Filtering
  if (filterOption) {
    updatedData = updatedData.filter((event) => event.status === filterOption);
  }

  // Search
  if (inputValue) {
    try {
      const response = await fetch(API_ENDPOINTS.fetchAll, {
        method: "GET",
        signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch all data. Status: ${response.status}`);
      }

      const responseData = await response.json();

      updatedData =
        responseData.data?.filter((event) =>
          event.title.toLowerCase().includes(inputValue.toLowerCase())
        ) || [];
    } catch (error) {
      console.error("Error fetching data:", error.message);
      throw error; // Rethrow the error so it can be handled by the caller
    }
  }

  // Sorting
  switch (sortOption) {
    case "id_asc":
      updatedData = updatedData.sort((a, b) => a.id - b.id);
      break;
    case "id_desc":
      updatedData = updatedData.sort((a, b) => b.id - a.id);
      break;
    case "title":
      updatedData = updatedData.sort((a, b) =>
        a.title.localeCompare(b.title, { sensitivity: "base" })
      );
      break;
    case "startDate":
      updatedData = updatedData.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      break;
    case "dueDate":
      updatedData = updatedData.sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
      break;
    default:
      break;
  }

  return updatedData;
}

// Fetch data function
const fetchData = async (setFetchedData, setErrorMessage, setLoading) => {
  try {
    setLoading(true);
    await handleFetchAll(setFetchedData, setErrorMessage);
  } catch (error) {
    setErrorMessage("Failed to fetch data");
  } finally {
    setLoading(false);
  }
};

function DisplayAll() {
  const [fetchedData, setFetchedData] = useState(null);
  const [requiredData, setRequiredData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [timeoutId, setTimeoutId] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const eventsPerPage = 4;

  // Derived states
  const totalEvents = requiredData ? requiredData.length : 0;
  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  const navigate = useNavigate();

  // Fetch all events on mount
  useEffect(() => {
    fetchData(setFetchedData, setErrorMessage, setLoading);
  }, []);

  // Updating requiredData based on search, sort, and filter
  useEffect(() => {
    const updateData = async () => {
      if (fetchedData) {
        setLoading(true);
        try {
          const updatedData = await processFetchedData(
            fetchedData,
            filterOption,
            "",
            sortOption
          );
          setRequiredData(updatedData);
        } catch (error) {
          console.error("Error processing data:", error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    updateData();
  }, [fetchedData, filterOption, sortOption]);

  // Deriving events to display for the current page
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = requiredData?.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle edit
  const handleEdit = (id) => {
    const selectedEvent = fetchedData.find((event) => event.id === id);
    navigate(`${Create}/${id}`, { state: { event: selectedEvent } });
  };

  // Handle view
  const handleView = (id) => {
    const selectedEvent = fetchedData.find((event) => event.id === id);
    navigate(`${Event}/${id}`, { state: { event: selectedEvent } });
  };

  // Handle delete
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

  // Handle search input with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Create a new AbortController for search
    const controller = new AbortController();
    const signal = controller.signal;

    const newTimeoutId = setTimeout(async () => {
      try {
        // Fetch or update data based on the search query
        const updatedData = await processFetchedData(
          fetchedData,
          filterOption,
          inputValue,
          sortOption,
          signal // Use the signal from the controller
        );
        setRequiredData(updatedData);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Search request was aborted");
        } else {
          console.error("Error in search:", error.message);
        }
      }
    }, 500);

    setTimeoutId(newTimeoutId);

    // Abort the previous request if necessary
    return () => controller.abort();
  };

  return (
    <div>
      {/* Event list */}
      <EventList
        requiredData={currentEvents}
        loading={loading}
        errorMessage={errorMessage}
        sortOption={sortOption}
        setSortOption={setSortOption}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
        inputValue={inputValue}
        handleSearch={handleSearch}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleView={handleView}
      />

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {!loading && <BackButton to={home} text="⬅️ Home" />}
    </div>
  );
}

export default DisplayAll;
