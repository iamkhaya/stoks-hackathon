import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "dotenv";
import routes from "./routes"; // Importing your routes
import errorMiddleware from "./middlewares/error-middleware"; // Importing your custom error handler

config(); // Load environment variables from .env

const app: Application = express();

// Global Middlewares
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers
app.use(morgan("dev")); // HTTP request logger
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// API Routes
app.use("/api", routes);

// Error handling middleware
app.use(errorMiddleware);

// Export the configured app
export { app };
