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
  avatar: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "The file is too large. Max size is 2MB.",
      (value) => !value || (value && value.size <= 2 * 1024 * 1024) // 2MB
    )
    .test(
      "fileType",
      "Only JPG and PNG files are allowed.",
      (value) =>
        !value ||
        (value && (value.type === "image/jpeg" || value.type === "image/png"))
    ),
});
