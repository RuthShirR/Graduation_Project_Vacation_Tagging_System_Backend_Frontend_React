import config from "../Utils/Config";

// ==========================
// ERRORS HELPER
// ==========================

// Return a formatted error message based on environment and error type
function getError(err: any): string {
  
  // Hide detailed errors in production environment
  if (!config.isDevelopment) {
    return "Some error occurred, please try again later.";
  }
  
  if (err instanceof Error) {
    return err.message;
  }
  
  return String(err);
}

const errorsHelper = {
  getError
};

export default errorsHelper;

