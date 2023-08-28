import express from "express";
import cors from "cors";
import morgan from "morgan";

import * as middleware from "./utils/middleware.js";
import helloRoute from "./routes/helloRouter.js";
import getBusInfo from "./utils/transit.js";
import { createClient } from "redis";

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
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();

  let bus = await client.get("bus:31");
  res.setHeader("X-data-source", "Redis");

  if (!bus) {
    const busData = await getBusInfo();

    bus = JSON.stringify(busData);

    await client.set("bus:31", bus, {
      // Expire in 30 mins
      EX: 60 * 30, 
    });

    res.setHeader("X-data-source", "Transit-API");
  }

  bus = JSON.parse(bus);

  res.status(200).json(bus);

  await client.disconnect();
});

app.use("/hello", helloRoute);

// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
