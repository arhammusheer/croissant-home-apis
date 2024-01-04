import Redis from "ioredis";
import { logger } from "./logger";

const LOG_OWNER = "redis";

const DEFAULT_EXPIRE_TIME = 60 * 10; // 10 minutes

export default class BusTimeCache {
  private _client!: Redis;
  private static instance: BusTimeCache;

  constructor(REDIS_URL: string) {
    // Singleton
    if (BusTimeCache.instance) {
      return BusTimeCache.instance;
    }

    this._client = new Redis(REDIS_URL);
    logger.info(LOG_OWNER, "Redis client created");
  }

  // Bus time cache
  public async getBusTime(bus_number: number) {
    const bus_time = await this._client.get(bus_number.toString());

    if (!bus_time) {
      logger.info(LOG_OWNER, `No bus time found for bus ${bus_number}`);
      return null;
    }

    logger.info(
      LOG_OWNER,
      `Found bus time for bus ${bus_number}: ${bus_time}`
    );

    return JSON.parse(bus_time);
  }

  public async setBusTime(
    bus_number: number,
    bus_time: JSON,
    expire_time: number = DEFAULT_EXPIRE_TIME
  ) {
    await this._client.set(
      bus_number.toString(),
      JSON.stringify(bus_time),
      "EX",
      expire_time
    );

    logger.info(LOG_OWNER, `Set bus time for bus ${bus_number} to ${bus_time}`);
  }

  public async deleteBusTime(bus_number: number) {
    await this._client.del(bus_number.toString());

    logger.info(LOG_OWNER, `Deleted bus time for bus ${bus_number}`);
  }
}
