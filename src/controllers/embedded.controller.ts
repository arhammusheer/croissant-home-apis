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

  // DataSource handling
  let setCache = false;
  let next_bus = await getBusResponseFromCache(bus_number_int);

  if (!next_bus) {
    next_bus = await getBusResponseFromUMTS(bus_number_int);
    setCache = true;
  }
  if (!next_bus) {
    res.status(200).json(-1);
    return;
  }

  const d = DateTime.fromISO(next_bus.edt, { zone: "America/New_York" });
  const bus_time_in_seconds = Math.floor(d.diffNow("seconds").seconds);

  // Remove cached bus time if it is negative
  if (bus_time_in_seconds < 0) {
    await cache.deleteBusTime(bus_number_int);
    res.status(200).json(-1);
    return;
  }
  if (setCache) {
    // Cache the bus time
    // Expire in 60 seconds before the bus arrives or 30 mins (whichever is first)
    const expire_time = Math.max(bus_time_in_seconds - 60, 60); // For zero or negative bus times, expire in 60 seconds
    const expiresIn = Math.min(expire_time, 30 * 60);

    await cache.setBusTime(bus_number_int, next_bus, expiresIn);
  }

  if (setCache) {
    res.header("X-Data-Source", "UMTS");
  } else {
    res.header("X-Data-Source", "Cache");
  }

  res.status(200).json(bus_time_in_seconds);
};

const getBusResponseFromCache = async (bus_number: number) => {
  const cached_bus_time = await cache.getBusTime(bus_number);

  if (cached_bus_time) {
    return cached_bus_time;
  }

  return null;
};

const getBusResponseFromUMTS = async (bus_number: number) => {
  const umts = await getEDTFromUMTS(bus_number as 30 | 31);

  const next_bus = umts[0];

  if (!next_bus) {
    return null;
  }

  return next_bus;
};
