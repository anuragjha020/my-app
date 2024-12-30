import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { validationSchema } from "../utils/formValidator";
import { handleSubmit, handleSearchById } from "../utils/Handler";
import FormRow from "../ui/FormRow";
import Button from "../ui/Button";
import "../styles/Form.css";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../ui/BackButton";

function MyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [eventData, setEventData] = useState();
  const [errorMessage, setErrorMessage] = useState(null);

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
      }
    : {
        title: "",
        untaggedOrganizers: "",
        startDate: "2025-01-01T18:30:00.000Z",
        dueDate: "2026-01-01T18:30:00.000Z",
        destinationLink: "",
        status: "",
      };

  // Navigate to "/event" after successful form submission
  const handleFormSubmit = async (formValues, { setSubmitting, resetForm }) => {
    try {
      await handleSubmit(formValues, { setSubmitting, resetForm });
      navigate("/event/listEvents");
    } catch (error) {
      console.error("Error during form submission", error);
      alert("Error during submission: " + error.message);
    }
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
        {({ errors, touched, isSubmitting, isValid }) => (
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
              placeholder="Select start date"
              error={touched.startDate && errors.startDate}
            />
            <FormRow
              label="Due Date"
              name="dueDate"
              placeholder="Select due date"
              error={touched.dueDate && errors.dueDate}
            />
            <FormRow
              label="Destination Link"
              name="destinationLink"
              type="text"
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
