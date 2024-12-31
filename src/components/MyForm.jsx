import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { validationSchema } from "../utils/formValidator";
import { handleSubmit, handleSearchById } from "../utils/Handler"; // Adjusted for getting event data
import FormRow from "../ui/FormRow";
import Button from "../ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../ui/BackButton";
import "../styles/Form.css";

function MyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [eventData, setEventData] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAvatar, setIsAvatar] = useState(true);

  useEffect(() => {
    if (id) {
      handleSearchById(id, setEventData, setErrorMessage);
    }
  }, [id]);

  if (id && !eventData && !errorMessage) {
    return <p>Loading event data...</p>;
  }

  const initialValues = eventData
    ? {
        id: eventData.data.id,
        title: eventData.data.title,
        untaggedOrganizers: eventData.data.untaggedOrganizers,
        startDate: eventData.data.startDate || "",
        dueDate: eventData.data.dueDate || "",
        destinationLink: eventData.data.destinationLink || "",
        status: eventData.data.status || "",
        avatar: eventData.data.avatar || null,
      }
    : {
        title: "",
        untaggedOrganizers: "",
        startDate: "2025-01-01T18:30:00.000Z",
        dueDate: "2026-01-01T18:30:00.000Z",
        destinationLink: "",
        status: "",
        avatar: null,
      };

  const handleFormSubmit = async (formValues, { setSubmitting, resetForm }) => {
    try {
      // Set default avatar if it's null
      if (!formValues.avatar) {
        formValues.avatar =
          "https://res.cloudinary.com/dh7ls2cvc/image/upload/v1735632501/avatars/mqortpvrbntvqzhvzj6j.jpg";
      }
      console.log("formData ", formValues);

      await handleSubmit(formValues, { setSubmitting, resetForm });
      navigate("/event/listEvents");
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitting(false);
    }
  };

  const handleRemoveAvatar = (setFieldValue) => {
    setFieldValue("avatar", null);
    document.getElementById("avatar").value = "";
    setIsAvatar(false);
  };

  return (
    <div className="form-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <Formik
        initialValues={initialValues}
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
            <div className="form-row">
              <label htmlFor="avatar">Avatar</label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                className="form-control"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue("avatar", file); // Set the selected file
                }}
              />

              {/* Here i'm Displaying the fetched avatar file name if available and no new file is selected */}
              {id &&
                typeof values.avatar === "string" &&
                !values.avatar.name && (
                  <>
                    {isAvatar && (
                      <p className="avatar-file-name">
                        Fetched Avatar: {values.avatar.split("/").pop()}
                        <span onClick={() => handleRemoveAvatar(setFieldValue)}>
                          ❌
                        </span>
                      </p>
                    )}
                  </>
                )}

              {/* Here i'm Displaying the selected file name */}
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
      <BackButton to="/" text="⬅️ Home" />
    </div>
  );
}

export default MyForm;
