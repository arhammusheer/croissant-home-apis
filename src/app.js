import express from "express";
import cors from "cors";
import morgan from "morgan";

import * as middleware from "./utils/middleware.js";
import helloRoute from "./routes/helloRouter.js";
import init from "./utils/redis.js";

const app = express();

// parse json request body
app.use(express.json());

// enable cors
app.use(cors());

// request logger middleware
app.use(morgan("tiny"));

// healthcheck endpoint
app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});


// BUS
app.get("/bus", async (req, res) => {
  const redis = init();

  const bus = await redis.get("bus:31");

  if (!bus) {
    return res.status(404).send({ error: "Bus not found" });
  }

  res.status(200).send(bus);
});

app.use("/hello", helloRoute);

// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
