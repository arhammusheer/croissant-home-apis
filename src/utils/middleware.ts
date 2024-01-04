import { ErrorRequestHandler, RequestHandler } from "express";
import { logger } from "./logger";

const LOG_OWNER = "middleware";

export const unknownEndpoint: RequestHandler = (req, res) => {
  res.status(404).send({ error: `uknonwn endpoint` });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  logger.error(LOG_OWNER, error.message);
  next(error);
};
