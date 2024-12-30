import React from "react";
import { useField } from "formik";
import "../styles/formRow.css";

const FormRow = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="form-row-container">
      <label htmlFor={props.id || props.name} className="form-row-label">
        {label}
      </label>
      <input
        {...field}
        {...props}
        className={`form-row-input ${
          meta.touched && meta.error ? "is-invalid" : ""
        }`}
      />
      {meta.touched && meta.error && (
        <div className="invalid-feedback">{meta.error}</div>
      )}
    </div>
  );
};

export default FormRow;
