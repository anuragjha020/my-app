import { API_BASE_URL } from "../variables/const";

const API_ENDPOINTS = {
  create: `${API_BASE_URL}/add`,
  update: (id) => `${API_BASE_URL}/update/${id}`,
  fetchAll: `${API_BASE_URL}/get`,
  // fetchById: (id) => `${API_BASE_URL}/get/${id}`,
  delete: (id) => `${API_BASE_URL}/delete/${id}`,
};

// function for errors
const handleError = (error, setErrorMessage) => {
  console.error("Error:", error.message);
  if (setErrorMessage) {
    setErrorMessage(error.message);
  }
  alert(`Error: ${error.message}`);
};

// Submit data (create or update)
export const handleSubmit = async (
  formValues,
  { setSubmitting, resetForm }
) => {
  try {
    const { id, avatar, ...otherFields } = formValues;

    let body;
    const headers = avatar ? undefined : { "Content-Type": "application/json" };

    if (avatar) {
      body = new FormData();
      Object.keys(formValues).forEach((key) => {
        body.append(key, formValues[key]);
      });
    } else {
      body = JSON.stringify({ ...otherFields, adminStatus: "approved" });
    }

    const response = await fetch(
      id ? API_ENDPOINTS.update(id) : API_ENDPOINTS.create,
      {
        method: id ? "PUT" : "POST",
        headers,
        body,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to ${id ? "update" : "create"} event: ${
          errorData.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    alert(`${id ? "Updated" : "Created"} event successfully!`);
    console.log(`${id ? "Updated" : "Created"} Event:`, data);

    if (!id) resetForm(); // Reset form only for create
  } catch (error) {
    handleError(error);
  } finally {
    setSubmitting(false);
  }
};

// Fetch all records
export const handleFetchAll = async (setFetchedData, setErrorMessage) => {
  try {
    const response = await fetch(API_ENDPOINTS.fetchAll, {
      method: "GET",
    });

    if (!response.ok) {
      // Check for specific status codes 404
      if (response.status === 404) {
        // Treat 404 as "no data found"
        console.warn("No data found in the database.");
        setFetchedData([]);
        if (setErrorMessage) setErrorMessage(null);
        return;
      }
      throw new Error(`Failed to fetch all data. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched all data:", data.data);

    setFetchedData(data.data);
    if (setErrorMessage) setErrorMessage(null);
  } catch (error) {
    handleError(error, setErrorMessage);
  }
};

// Fetch a specific record by ID
// export const handleSearchById = async (id, setFetchedData, setErrorMessage) => {
//   try {
//     const response = await fetch(API_ENDPOINTS.fetchById(id), {
//       method: "GET",
//     });

//     if (!response.ok) {
//       throw new Error(`No data found for ID: ${id}`);
//     }

//     const data = (await response.json()).data;
//     console.log("Fetched data by ID:", data);

//     const requiredData = {
//       id: data.id,
//       title: data.title,
//       untaggedOrganizers: data.untaggedOrganizers,
//       startDate: data.startDate,
//       dueDate: data.dueDate,
//       destinationLink: data.destinationLink,
//       status: data.status,
//       avatar: data.avatar,
//       publicId: data.publicId,
//     };
//     console.log("requiredData", requiredData);

//     setFetchedData(requiredData);
//     if (setErrorMessage) setErrorMessage(null);
//   } catch (error) {
//     handleError(error, setErrorMessage);
//   }
// };

// Delete a record
export const handleDelete = async (id) => {
  try {
    const response = await fetch(API_ENDPOINTS.delete(id), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete record.");
    }

    alert(`Record with ID ${id} deleted successfully!`);
    console.log(`Deleted record with ID: ${id}`);
  } catch (error) {
    handleError(error);
  }
};
