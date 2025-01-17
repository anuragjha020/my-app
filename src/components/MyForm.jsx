import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";

import { validationSchema } from "../utils/formValidator";
import { handleSubmit } from "../utils/Handler";
import FormRow from "../ui/FormRow";
import Button from "../ui/Button";
import BackButton from "../ui/BackButton";
import "../styles/Form.css";
import { API_ENDPOINTS, date, EventList, home } from "../variables/const";
import { formatDate } from "../utils/formateDate";

// Fetch data based on the provided ID
const fetchData = async (id, setEventData, setErrorMessage, setLoading) => {
  if (id) {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.fetchById(id)}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const requiredData = {
        id: data.data.id,
        title: data.data.title,
        untaggedOrganizers: data.data.untaggedOrganizers,
        startDate: data.data.startDate,
        dueDate: data.data.dueDate,
        destinationLink: data.data.destinationLink,
        status: data.data.status,
        avatar: data.data.avatar,
        publicId: data.data.publicId,
      };
      console.log("requiredData", requiredData);

      setEventData(requiredData);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }
};

function MyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAvatar, setIsAvatar] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(id, setEventData, setErrorMessage, setLoading);
  }, [id]);

  if (id && !eventData && !errorMessage) {
    return <p>Loading event data...</p>;
  }

  const data = {
    ...(eventData ? { id: eventData.id } : {}),
    title: eventData?.title ?? "",
    untaggedOrganizers: eventData?.untaggedOrganizers ?? "",
    startDate:
      (eventData ? formatDate(eventData?.startDate) : eventData?.startDate) ??
      formatDate(date),
    dueDate:
      (eventData ? formatDate(eventData?.dueDate) : eventData?.duetDate) ??
      formatDate(new Date(date).setDate(new Date(date).getDate() + 1)),
    destinationLink: eventData?.destinationLink ?? "",
    status: eventData?.status ?? "",
    avatar: eventData?.avatar ?? null,
    publicId: eventData?.publicId ?? null,
    avatarRemove: false,
  };

  const handleFormSubmit = async (formValues, { setSubmitting, resetForm }) => {
    try {
      console.log("formData ", formValues);

      await handleSubmit(formValues, { setSubmitting, resetForm });
      navigate(EventList);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error);
      setSubmitting(false);
    }
  };

  const handleRemoveAvatar = (setFieldValue) => {
    setFieldValue("avatar", null);
    setFieldValue("avatarRemove", true);
    document.getElementById("avatar").value = "";
    setIsAvatar(false);
  };

  return (
    <div className="form-container">
      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : (
        <Formik
          initialValues={data}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize={true}
        >
          {({
            errors,
            touched,
            setFieldValue,
            isSubmitting,
            isValid,
            values,
          }) => (
            <Form className="form">
              <FormRow
                label="Title"
                name="title"
                type="text"
                placeholder="Enter title"
                error={touched.title && errors.title}
              />
              <FormRow
                label="Organizers"
                name="untaggedOrganizers"
                type="text"
                placeholder="Enter organizers"
                error={touched.untaggedOrganizers && errors.untaggedOrganizers}
              />
              <FormRow
                label="Start Date"
                name="startDate"
                type="date"
                placeholder="Select start date"
                error={touched.startDate && errors.startDate}
              />
              <FormRow
                label="Due Date"
                name="dueDate"
                type="date"
                placeholder="Select due date"
                error={touched.dueDate && errors.dueDate}
              />
              <FormRow
                label="Destination Link"
                name="destinationLink"
                type="url"
                placeholder="Enter destination link"
                error={touched.destinationLink && errors.destinationLink}
              />
              <div className="form-row">
                <label htmlFor="status">Status</label>
                <Field
                  as="select"
                  name="status"
                  id="status"
                  className="form-control"
                >
                  <option value="">Select status</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Field>
                {touched.status && errors.status && (
                  <div className="error-message">{errors.status}</div>
                )}
              </div>
              <div className="form-row-avatar">
                <label htmlFor="avatar">Avatar</label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  className="form-control"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    setFieldValue("avatar", file);
                    setFieldValue("avatarRemove", false);
                  }}
                />

                {/* Display fetched avatar file name if available and no new file is selected */}
                {id &&
                  typeof values.avatar === "string" &&
                  !values.avatar.name && (
                    <>
                      {isAvatar && (
                        <p className="avatar-file-name">
                          Fetched Avatar: {values.avatar.split("/").pop()}
                          <span
                            onClick={() => handleRemoveAvatar(setFieldValue)}
                          >
                            ❌
                          </span>
                        </p>
                      )}
                    </>
                  )}

                {/* Display the selected file name */}
                {values.avatar && typeof values.avatar !== "string" && (
                  <p className="avatar-file-name">
                    Selected File: {values.avatar.name}
                    <span onClick={() => handleRemoveAvatar(setFieldValue)}>
                      ❌
                    </span>
                  </p>
                )}

                {touched.avatar && errors.avatar && (
                  <div className="error-message">{errors.avatar}</div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="btn-submit"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting
                  ? id
                    ? "Updating..."
                    : "Creating..."
                  : id
                  ? "Update"
                  : "Create"}
              </Button>
            </Form>
          )}
        </Formik>
      )}
      <BackButton to={home} text="⬅️ Home" />
    </div>
  );
}

export default MyForm;
