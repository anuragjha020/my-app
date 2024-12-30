const API_BASE_URL = `http://172.16.16.172:4040/event`;
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoyLCJlbWFpbCI6ImplZXRAdGVjaHV6LmNvbSIsInN0YXR1cyI6IjIiLCJwdXJwb3NlIjoiYXV0aCJ9LCJpYXQiOjE3MzQ1OTMyNTcsImV4cCI6MTczNDY3OTY1N30.M5MSCXHYwIIW7gC85SoZnK8XFiVS_-qGvWHuWgazeR1V1HyUKWKG4oGpt2dJ0sewqisSkcUE9B4f81zWemWNY3fQEXZd6GQE9-b5P5SJAsfgE3Wc-LA5_JY8v_mmtWFmNQR84ahIXvSvztgOeHxq8fW8PdRWw0YIpAp4vOpRjiqn1gw9em3gGwQjsN72NRo0RbibRY0SjMihU_Wf7H-a5ApoOx84R4jIZ8jRL1N5Vo25TTvJ7mNS2P72342ga3Wk5KvrH-0nZiJ1-Sutnslf67HlAXHgPqiDPiAlhU-wCuH9IhskD9padOJ-qDv6_4Hv7fhNqCiFxXiK7cIFfwsRGpGKSv7-SI9maEWnodcTFLRiT8VSYKVK565pSI_4jqNSLinLkogP01KFP6H3TlC4bXe96aQUCUOqpMe18WF9x6qg7qpW-p2pLY3kLpf5Gpf2Bhy690d8G9ODQVdrsDCFOy1hV-7SUP_JTHSiE81iYtsisv5b5RjG8UBTyzNneH8am6xdjJYsJXrMqKpkFmob_-Cr9vjIXvE5rxfPUPNZ6J6iaM46tlqGavKXSLRen2TwUrQR2s46vzvnnWvmEdKlYVoyM7sgcO54euW4zOUhTd7NUdXI98tjZe_lvrI12n9mS62bKqxiK-esy1lKdt4_c6w8VH_8Qqjollql4KKJ-Lk";

// Submit data ======================================================
export const handleSubmit = async (
  formValues,
  { setSubmitting, resetForm }
) => {
  console.log("Submitting values:", formValues);

  try {
    const {
      id,
      title,
      untaggedOrganizers,
      startDate,
      dueDate,
      destinationLink,
      status,
    } = formValues;

    const payload = {
      id,
      title,
      untaggedOrganizers,
      startDate,
      dueDate,
      destinationLink,
      status,
      adminStatus: "approved",
    };
    console.log("payload to send", payload);

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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

export const handleFetchAll = async (
  setFetchedData,
  setErrorMessage,
  setFetchedDataById
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listEvents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const response = await fetch(`${API_BASE_URL}/get?eventId=${searchId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data by ID.");
    }

    const data = await response.json();
    setFetchedDataById(data);
    setErrorMessage(null);
  } catch (error) {
    console.error("Error fetching by ID:", error);
    setErrorMessage(error.message);
  }
};

// Update a record=========================================

// export const handleUpdate = async (id, editData) => {
//   try {
//     const {
//       id,
//       title,
//       untaggedOrganizers,
//       startDate,
//       dueDate,
//       destinationLink,
//       adminStatus,
//     } = editData;

//     const payload = {
//       id,
//       title,
//       untaggedOrganizers,
//       startDate,
//       dueDate,
//       destinationLink,
//       adminStatus,
//     };

//     console.log("Payload to send:", payload);

//     const response = await fetch(`${API_BASE_URL}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Error Response:", errorData);
//       throw new Error(
//         `Failed to update record. ${errorData.message || "Unknown error"}`
//       );
//     }

//     const data = await response.json();
//     console.log("Updated Record:", data);

//     alert(`Record with ID ${id} updated successfully!`);
//   } catch (error) {
//     console.error("Update error:", error);
//     alert("Error updating record: " + error.message);
//   }
// };

// Delete a record
export const handleDelete = async (id) => {
  try {
    console.log("delete called");

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(id);

      const errorData = await response.json();
      console.error("Error Response:", errorData);
      throw new Error("Failed to delete record.");
    }

    alert(`Record with ID ${id} deleted successfully!`);
  } catch (error) {
    console.error("Delete error:", error);
    alert("Error deleting record: " + error.message);
  }
};
