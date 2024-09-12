import { Router } from "express";
import getEDTFromUMTS from "../utils/umts";
import { embeddedBus } from "../controllers/embedded.controller";
import { logger } from "../utils/logger";

const LOG_OWNER = "umtsRouter";

const umtsRouter = Router();

const allowed_routes = [30, 31];
// New York time
const tz = "America/New_York";
const downTime = {
  30: {
    start: [1, 0], // 1:00 AM TZ
    end: [5, 30], // 5:30 AM TZ
  },
  31: {
    start: [1, 0], // 1:00 AM TZ
    end: [5, 30], // 5:30 AM TZ
  },
} as Record<number, { start: [number, number]; end: [number, number] }>;

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
  if (downTimeCheck(bus_number_int)) {
    res.status(503).json({
      error: "Requested route downtime is active",
      downtime: downTime[bus_number_int],
    });
    return;
  }

  console.log(`Requesting UMTS data for bus ${bus_number_int}`);

  const busData = await getEDTFromUMTS(bus_number_int as 30 | 31);

  res.status(200).json(busData);
});

umtsRouter.get("/:bus_number/embedded", (req, res) => {
  try {
    const { bus_number } = req.params as { bus_number: string };

    if (downTimeCheck(parseInt(bus_number))) {
      console.log(`Down time for bus ${bus_number}. Request rejected.`);
      res.status(503).json(-1);
      return;
    }

    embeddedBus(bus_number, res);
  } catch (error) {
    logger.error(LOG_OWNER, error);
    res.json(-1);
  }
});

const downTimeCheck = (bus_number: number) => {
  const now = new Date();
  const [start_hour, start_minute] = downTime[bus_number].start;
  const [end_hour, end_minute] = downTime[bus_number].end;

  const start_time = new Date();
  start_time.setHours(start_hour, start_minute, 0, 0);
  const end_time = new Date();
  end_time.setHours(end_hour, end_minute, 0, 0);

  return now >= start_time && now <= end_time;
};

export default umtsRouter;
