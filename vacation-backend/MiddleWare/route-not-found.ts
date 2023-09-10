
import { Request, Response, NextFunction } from "express";
import { RouteNotFoundError } from "../Models/Client-Errors";

// ==========================
// ERROR HANDLER MIDDLEWARE
// ==========================


// middleware for handling not found routes
const ErrorHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const err = new RouteNotFoundError(request.originalUrl);
  next(err);
};

export default ErrorHandler;

