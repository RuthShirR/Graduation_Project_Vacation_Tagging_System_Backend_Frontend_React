import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../Utils/Config";

// =================================
// MIDDLEWARE: VERIFY ADMIN
// =================================


// verify if a user is an admin
function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  // Check if the authorization header is present
  if (!req.headers.authorization)
    return res.status(401).send("You are not logged in!");

  // Extract the token from the authorization header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).send("You are not logged in!");
  // Verify the token 
  jwt.verify(token, config.jwtKey, (err: jwt.VerifyErrors | null, payload: any) => {
    // Handle token verification errors
    if (err && err.message === "jwt expired") {
      return res.status(403).send("Your login session has expired.");
    }
    if (err) return res.status(401).send("You are not logged in!");
    // Check if the user is an admin based on the payload
    if (!payload.payload.isAdmin)
      return res.status(403).send("You are not authorized");

    next();
  });
}

export default verifyAdmin;
