//===================This Api is created by me ========================================
const API_BASE_URL = `http://localhost:5000/api/events`;

// Submit data ======================================================
export const handleSubmit = async (
  formValues,
  { setSubmitting, resetForm }
) => {
  console.log("Submitting values:", formValues);

  try {
    const {
      id, // Only required for update
      title,
      untaggedOrganizers,
      startDate,
      dueDate,
      destinationLink,
      status,
    } = formValues;

    const payload = {
      title,
      untaggedOrganizers,
      startDate,
      dueDate,
      destinationLink,
      status,
      adminStatus: "approved",
    };
    console.log("payload to send", payload);

    // If ID is present, update the record using PUT, else create using POST
    // Use PUT for updates, POST for creates
    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_BASE_URL}/update/${id}` // Update URL with ID
      : `${API_BASE_URL}/add`; // Create URL

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Response:", errorData);
      throw new Error(
        `Failed to ${id ? "update" : "create"} event. ${
          errorData.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    console.log(`${id ? "Updated" : "Created"} Event:`, data);

    alert(`${id ? "Updated" : "Created"} event successfully!`);
  } catch (error) {
    console.error(`${formValues.id ? "Update" : "Create"} error:`, error);
    alert(`${formValues.id ? "Update" : "Create"} error: ${error.message}`);
  } finally {
    setSubmitting(false);
    resetForm();
  }
};

// Fetch all records ==================================================
export const handleFetchAll = async (setFetchedData, setErrorMessage) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all data.");
    }

    setFetchedData(null);

    const data = await response.json();
    console.log("api data", data);

    setFetchedData(data);
    setErrorMessage(null);
  } catch (error) {
    console.error("Error fetching all data:", error);
    setErrorMessage(error.message);
  }
};

// Fetch a specific record by ID =============================================
export const handleSearchById = async (
  searchId,
  setFetchedDataById,
  setErrorMessage
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get/${searchId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`No data found for ID : ${searchId}`);
    }

    const data = await response.json();
    setFetchedDataById(data);
    setErrorMessage(null);
  } catch (error) {
    console.error("Error fetching by ID:", error);
    setErrorMessage(error.message);
  }
};

// Delete a record
export const handleDelete = async (id) => {
  try {
    console.log("delete called");

    const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Response:", errorData);
      throw new Error("Failed to delete record.");
    }

    alert(`Record with ID ${id} deleted successfully!`);
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Delete error:", error);
    alert("Error deleting record: " + error.message);
  }
};
