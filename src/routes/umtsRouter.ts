import { Router } from "express";
import getEDTFromUMTS from "../utils/umts";
import { createClient } from "redis";
import { embeddedBus } from "../controllers/embedded.controller";

const umtsRouter = Router();

const allowed_routes = [30, 31];

const client = createClient({
  url: process.env.REDIS_URL,
});

umtsRouter.get("/:bus_number", async (req, res) => {
  const { bus_number } = req.params as { bus_number: string };

  const bus_number_int = parseInt(bus_number);

  if (!bus_number_int) {
    res.status(400).json({ error: "Invalid bus number" });
    return;
  }

  if (!allowed_routes.includes(bus_number_int)) {
    res.status(400).json({ error: "Invalid bus number, must be 30 or 31" });
    return;
  }
  const busData = await getEDTFromUMTS(bus_number_int as 30 | 31);

  res.status(200).json(busData);
});

umtsRouter.get("/:bus_number/embedded", (req, res) => {
  const { bus_number } = req.params as { bus_number: string };

  embeddedBus(bus_number, res);
});

export default umtsRouter;
