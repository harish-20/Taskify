import multer from "multer";

export const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
