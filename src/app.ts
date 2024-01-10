// Express app setup
import express from "express";
import cors from "cors";

// Error handling middleware
import { errorHandler, unknownEndpoint } from "./utils/middleware";

// Routes
import router from "./routes/root.router";
import { logger, morganwrapped } from "./utils/logger";
import BusTimeCache from "./utils/redis";
import { prometheus } from "./utils/prometheus";

const app = express();

const cache = new BusTimeCache(process.env.REDIS_URL!);

// parse json request body
app.use(express.json());

// enable cors
app.use(cors());

// request logger middleware
app.use(morganwrapped());

// Prometheus metrics
app.use(prometheus);

// Routes
app.use(router);

// custom middleware
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
