import express from "express";
import cors from "cors";
import morgan from "morgan";

import * as middleware from "./utils/middleware.js";
import helloRoute from "./routes/helloRouter.js";
import getBusInfo from "./utils/transit.js";
import { createClient } from "redis";
import axios from "axios";

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

    // Expire 30s after first bus left. or after 30 mins whichever is less
    const expiresAt =
      busData &&
      busData.route_departures[0].itineraries[0].schedule_items[0]
        .departure_time + 30;

    await client.set("bus:31", bus, {
      // Expire in 30 mins
      EXAT: expiresAt > Date.now() + 1800 ? Date.now() + 1800 : expiresAt,
    });

    res.setHeader("X-data-source", "Transit-API");
  }

  bus = JSON.parse(bus);

  res.status(200).json(bus);

  await client.disconnect();
});

// Bus for embedded devices: Returns integer
app.get("/bus-embedded", async (req, res) => {
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

    // Expire 30s after first bus left. or after 30 mins whichever is less
    const expiresAt =
      busData &&
      busData.route_departures[0].itineraries[0].schedule_items[0]
        .departure_time + 30;

    await client.set("bus:31", bus, {
      // Expire in 30 mins
      EXAT: expiresAt > Date.now() + 1800 ? Date.now() + 1800 : expiresAt,
    });

    res.setHeader("X-data-source", "Transit-API");
  }

  bus = JSON.parse(bus);

  const nextBus =
    bus.route_departures[0].itineraries[0].schedule_items[0].departure_time;

  const now = Math.floor(Date.now() / 1000);

  const timeToNextBus = nextBus - now;

  res.status(200).json(timeToNextBus);

  await client.disconnect();
});

app.get("/finance-news", async (req, res) => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();

  const getNews = async () => {
    let news = await client.get("finance-news");
    res.setHeader("X-data-source", "Redis");

    if (!news) {
      const newsData = await axios.get(
        `https://api.polygon.io/v2/reference/news?limit=50&apiKey=${process.env.POLYGON_API_KEY}`
      );

      news = JSON.stringify(newsData.data.results);

      await client.set("finance-news", news, {
        // Expire in 30 mins
        EXAT: Date.now() + 1800,
      });

      res.setHeader("X-data-source", "Polygon-API");
    }

    news = JSON.parse(news);

    return news;
  };

  const news = await getNews();

  res.status(200).json(news);
});

app.use("/hello", helloRoute);

// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;

const EXAMPLE_BUS = {
  route_departures: [
    {
      global_route_id: "PVTAMA:116200",
      itineraries: [
        {
          branch_code: "",
          direction_headsign: "Sunderland",
          direction_id: 0,
          headsign: "Sunderland",
          merged_headsign: "Sunderland",
          schedule_items: [
            {
              departure_time: 1693255980,
              is_cancelled: false,
              is_real_time: false,
              rt_trip_id: "4017495-UM2223-UMTS-Weekday-78",
              scheduled_departure_time: 1693255980,
              trip_search_key: "PVTAMA:43094228:5:0:16",
              wheelchair_accessible: 1,
            },
            {
              departure_time: 1693258080,
              is_cancelled: false,
              is_real_time: false,
              rt_trip_id: "4017523-UM2223-UMTS-Weekday-78",
              scheduled_departure_time: 1693258080,
              trip_search_key: "PVTAMA:43094228:5:0:17",
              wheelchair_accessible: 1,
            },
            {
              departure_time: 1693260180,
              is_cancelled: false,
              is_real_time: false,
              rt_trip_id: "4017496-UM2223-UMTS-Weekday-78",
              scheduled_departure_time: 1693260180,
              trip_search_key: "PVTAMA:43094228:5:0:18",
              wheelchair_accessible: 1,
            },
          ],
        },
      ],
      mode_name: "Bus",
      real_time_route_id: "20031",
      route_color: "ea6083",
      route_long_name: "Sunderland  /  South Amherst",
      route_network_id: "PVTA|Boston",
      route_network_name: "PVTA",
      route_short_name: "31",
      route_text_color: "ffffff",
      route_type: 3,
      sorting_key: "31",
      tts_long_name: "Sunderland  /  South Amherst",
      tts_short_name: "31",
    },
  ],
};
