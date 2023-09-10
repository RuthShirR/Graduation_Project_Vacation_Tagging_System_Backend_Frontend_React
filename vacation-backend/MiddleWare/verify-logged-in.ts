import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../Utils/Config";

// =================================
// MIDDLEWARE: VERIFY LOGGED IN
// =================================

// verify if a user is logged in
function verifyLoggedIn(req: Request, res: Response, next: NextFunction) {
  // Check if the authorization header is present
  if (!req.headers.authorization)
    return res.status(401).send("You are not logged in!");
  // Extract the token from the authorization header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).send("You are not logged in!");

  try {
    jwt.verify(token, config.jwtKey, (err: jwt.VerifyErrors | null, payload: any) => {
      // Handle token verification errors
      if (err && err.message === "jwt expired") {
        return res.status(403).send("Your login session has expired.");
      }
      if (err) return res.status(401).send("You are not logged in!");
      // Attach the user details from the token payload to the request headers
      req.headers.userDetails = payload.payload;

      next();
    });
  } catch (err) {
    // Handle any errors that occur during token verification
    res.status(500).send("An error occurred while verifying the token.");
  }
}

export default verifyLoggedIn;


