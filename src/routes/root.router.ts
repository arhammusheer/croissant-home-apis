import { Router } from "express";
import { embeddedBus } from "../controllers/embedded.controller";
import umtsRouter from "./umtsRouter";
import profilesRouter from "./profiles.router";

const router = Router();

// Healthcheck endpoint
router.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

// UMTS Router
router.use("/umts", umtsRouter);

// LEGACY: Backwards compatibility for old IOT device
router.get("/bus-embedded", async (req, res) => {
  const { bus_number = "31" } = req.query as { bus_number: string };

  embeddedBus(bus_number, res);
});

router.use("/profile", profilesRouter);

export default router;
