import jwt from "jsonwebtoken";
import config from "../Utils/Config";


// ==========================
// JWT HELPER
// ==========================

// Generate a new JWT token 
function getNewToken(payload: any): string {
  return jwt.sign({ payload }, config.jwtKey, { expiresIn: "24h"  });
}

export default {
  getNewToken,
};
