import * as Yup from "yup";

export const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  untaggedOrganizers: Yup.string().required("Organizers are required"),
  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Invalid date format"),
  destinationLink: Yup.string()
    .url("Must be a valid URL")
    .required("Destination link is required"),
  status: Yup.string()
    .oneOf(["draft", "pending", "approved", "rejected"], "Invalid status")
    .required("Status is required"),
});
