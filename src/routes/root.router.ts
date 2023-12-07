import { Request, Response, Router } from "express";
import { createClient } from "redis";
import getBusInfo from "../utils/transit";
import umtsRouter from "./umtsRouter";
import { EXAMPLE_BUS } from "../app";
import { embeddedBus } from "../controllers/embedded.controller";

const router = Router();
const client = createClient({
  url: process.env.REDIS_URL,
});

// Healthcheck endpoint
router.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

// UMTS Router
router.use("/umts", umtsRouter);

// BUS
router.get("/bus", async (req: Request, res: Response) => {
  const { bus_number = "31" } = req.query as { bus_number: string };

  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();

  let bus = await client.get(`bus:${bus_number}`);
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

router.get("/bus-embedded", async (req, res) => {
  const { bus_number = "31" } = req.query as { bus_number: string };

  embeddedBus(bus_number, res);
});

export default router;
