import express_prom_bundle from "express-prom-bundle";
import { logger } from "./logger";

const LOG_OWNER = "prometheus";
const ENABLE_PROMETHEUS = process.env.ENABLE_PROMETHEUS === "true";

const prometheusMiddleware = express_prom_bundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
});

if (ENABLE_PROMETHEUS) {
  logger.info(LOG_OWNER, "Prometheus enabled");
}

// Prometheus metrics
export const prometheus = ENABLE_PROMETHEUS ? prometheusMiddleware : (_req: any, _res: any, next: any) => next();