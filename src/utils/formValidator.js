import * as Yup from "yup";
import { maxSize } from "../variables/const";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  untaggedOrganizers: Yup.string().required("Organizers are required"),

  //validated start and due date
  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Invalid date format")
    .min(today, "Start date must be today or later"),

  dueDate: Yup.date()
    .required("Due date is required")
    .typeError("Invalid date format")
    .when("startDate", (startDate, schema) => {
      if (startDate) {
        const nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1); // Add 1 day to startDate
        return schema.min(
          nextDay,
          "Due date must be at least 1 day after the start date"
        );
      }
      return schema;
    }),

  // startDate: Yup.date()
  //   .required("Start date is required")
  //   .typeError("Invalid date format"),
  destinationLink: Yup.string()
    .url("Must be a valid URL")
    .required("Destination link is required"),
  status: Yup.string()
    .oneOf(["draft", "pending", "approved", "rejected"], "Invalid status")
    .required("Status is required"),
  avatar: Yup.mixed()
    .nullable()
    .test(
      "fileOrUrl",
      `Invalid avatar. Must be a file or a valid URL.`,
      (value) =>
        !value || // Allow no value
        (typeof value === "object" && value.size <= maxSize * 1024 * 1024) || // Validate file object
        (typeof value === "string" && value.startsWith("http")) // Allow URL strings
    )
    .test(
      "fileType",
      "Only JPG and PNG files are allowed.",
      (value) =>
        !value || // Allow no value
        typeof value === "string" || // Skip type check for URLs
        value.type === "image/jpeg" ||
        value.type === "image/png" // Validate file type
    ),
});
