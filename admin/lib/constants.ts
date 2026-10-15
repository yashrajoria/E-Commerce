/** User-facing error messages reused by the admin upload flows. */
export const ERROR_MESSAGES = {
  /** Shown when an upload request fails for an unknown reason. */
  uploadFailed: "An error occurred during upload.",
  /** Shown when the selected file is not a JPEG, PNG or GIF. */
  invalidFileType: "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
  /** Shown when the selected file exceeds the 5MB limit. */
  fileSizeExceeded: "File size exceeds the 5MB limit.",
};

/** User-facing success messages reused by the admin upload flows. */
export const SUCCESS_MESSAGES = {
  /** Shown when an upload finishes successfully. */
  uploadSuccess: "File uploaded successfully!",
};
