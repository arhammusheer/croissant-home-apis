import { Response } from "express";
import getEDTFromUMTS from "../utils/umts";
import { DateTime } from "luxon";
import BusTimeCache from "../utils/redis";

const allowed_routes = [30, 31];

const cache = new BusTimeCache(process.env.REDIS_URL!);

export const embeddedBus = async (bus_number: string, res: Response) => {
  const bus_number_int = parseInt(bus_number);

  if (!bus_number_int) {
    res.status(400).json(-1);
    return;
  }

  if (!allowed_routes.includes(bus_number_int)) {
    res.status(400).json(-1);
    return;
  }

  // Redis cache
  const cached_bus_time = await cache.getBusTime(bus_number_int);

  if (cached_bus_time) {
    res.header("X-Data-Source", "redis");
    res.status(200).json(cached_bus_time);
    return;
  }

  // UMTS
  res.header("X-Data-Source", "umts");
  const umts = await getEDTFromUMTS(bus_number_int as 30 | 31);
  const next_bus = umts[0];
  if (!next_bus) {
    res.status(200).json(-1);
    return;
  }
  const d = DateTime.fromISO(next_bus.edt, { zone: "America/New_York" });
  const bus_time_in_seconds = Math.floor(d.diffNow("seconds").seconds);
  
  // Cache the bus time
  // Expire in 60 seconds before the bus arrives or 30 mins (whichever is first)
  const expiresIn = Math.min(bus_time_in_seconds - 60, 60 * 30);


  await cache.setBusTime(bus_number_int, bus_time_in_seconds, expiresIn);

  res.status(200).json(bus_time_in_seconds);
};
