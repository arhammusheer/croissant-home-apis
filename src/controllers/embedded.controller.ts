import { Request, Response } from "express";
import { createClient } from "redis";
import getEDTFromUMTS from "../utils/umts";

const allowed_routes = [30, 31];

export const embeddedBus = async (bus_number: string, res: Response) => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });
  await client.connect();

  const bus_number_int = parseInt(bus_number);

  if (!bus_number_int) {
    res.status(400).json(999);
    client.disconnect();
    return;
  }

  if (!allowed_routes.includes(bus_number_int)) {
    res.status(400).json(999);
    client.disconnect();
    return;
  }

  // Redis cache
  const cached = await client.get(`umts:${bus_number_int}`);
  console.log("cached", cached);

  let busData = [];

  if (cached) {
    res.header("X-response-source", "redis");
    busData = JSON.parse(cached);
  } else {
    res.header("X-response-source", "umts");

    busData = await getEDTFromUMTS(bus_number_int as 30 | 31);
  }

  const next_departure = busData[0];

  // EDT is in Eastern Time, so we need to convert it to UTC
  const edt_date = new Date(next_departure.edt);
  const utc_edt = edt_date;

  const next_edt_in_seconds = Math.round(
    (utc_edt.getTime() - Date.now()) / 1000
  );
  
  // 600 seconds or 60 seconds before the next departure
  const expiry =
    next_edt_in_seconds - 600 > 60 ? 600 : next_edt_in_seconds > 60 ? 60 : 1;

  await client.set(`umts:${bus_number_int}`, JSON.stringify(busData), {
    EX: expiry,
  });

  await client.disconnect();

  return res.json(next_edt_in_seconds);
};
