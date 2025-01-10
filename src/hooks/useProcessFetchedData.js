import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../variables/const";

const useProcessFetchedData = (
  fetchedData,
  filterOption,
  inputValue,
  sortOption,
  signal
) => {
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const processFetchedData = async () => {
      if (!fetchedData) return;

      let updatedData = [...fetchedData];

      // Filtering
      if (filterOption) {
        updatedData = updatedData.filter(
          (event) => event.status === filterOption
        );
      }

      // Search
      if (inputValue) {
        try {
          const response = await fetch(`${API_ENDPOINTS.fetchAll}`, {
            method: "GET",
            signal,
          });
          if (!response.ok) throw new Error("Failed to fetch data.");
          const responseData = await response.json();
          updatedData = responseData.data?.filter((event) =>
            event.title.toLowerCase().includes(inputValue.toLowerCase())
          );
        } catch (error) {
          if (error.name !== "AbortError") console.error(error.message);
        }
      }

      // Sorting
      if (sortOption) {
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
      }

      setProcessedData(updatedData);
    };

    processFetchedData();
  }, [fetchedData, filterOption, inputValue, sortOption, signal]);

  return processedData;
};

export default useProcessFetchedData;
