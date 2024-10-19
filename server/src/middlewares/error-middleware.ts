import { Request, Response, NextFunction } from "express";

// Define a custom error interface to handle specific error cases
interface CustomError extends Error {
  status?: number;
}

// Error-handling middleware function
export const errorMiddleware = (
  err: CustomError, // The error object, which may have a custom status and message
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Set a default status code (500 for internal server error)
  const statusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  // Log the error for debugging purposes (in production, you may want to log this differently)
  console.error(`Error: ${errorMessage} | Status Code: ${statusCode}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack); // Log stack trace in development environment
  }

  // Send a structured error response back to the client
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Include stack trace in dev environment
  });
};

export default errorMiddleware;
