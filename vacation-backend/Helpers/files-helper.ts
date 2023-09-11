import fs from "fs";
import multer from "multer";
import path from "path";

// ==========================
// FILES HELPER
// ==========================

// Configure multer for file uploads
export const configureFileUpload = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images/vacations");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });

  return multer({ storage: storage });
};

// Safely delete a file if it exists
export const safeDelete = (filePath: string) => {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${filePath}`, err);
        } else {
          console.log(`File deleted: ${filePath}`);
        }
      });
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  });
};


