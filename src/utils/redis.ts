import Redis from "ioredis";
import { logger } from "./logger";

const LOG_OWNER = "redis";

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

  public async getBusTime(bus_number: string) {
    const bus = await this._client.get(`bus:${bus_number}`);

    if (!bus) {
      return null;
    }

    return JSON.parse(bus);
  }
}
