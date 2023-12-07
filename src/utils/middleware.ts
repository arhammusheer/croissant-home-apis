import { ErrorRequestHandler, RequestHandler } from "express";
import * as logger from "./logger";

export const unknownEndpoint: RequestHandler = (req, res) => {
  res.status(404).send({ error: `uknonwn endpoint` });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  logger.error(error.message);
  next(error);
};
