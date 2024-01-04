import { Request, Response } from "express";
import getEDTFromUMTS from "../utils/umts";
import { DateTime } from "luxon";

const allowed_routes = [30, 31];

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

  let busData = [];

  res.header("X-response-source", "umts");

  busData = await getEDTFromUMTS(bus_number_int as 30 | 31);

  const next_departure = busData[0];

  if (!next_departure) {
    res.status(200).json(-1);
    return;
  }

  const edt = next_departure.edt;

  const d = DateTime.fromISO(edt, { zone: "America/New_York" });

  const bus_time_in_seconds = Math.floor(d.diffNow("seconds").seconds);

  const expiresIn =
    bus_time_in_seconds > 250 ? 250 : bus_time_in_seconds > 50 ? 50 : 1;

  res.status(200).json(bus_time_in_seconds);
};
