import { Router } from "express";
import { getProfile } from "../controllers/profiles.controller";

const router = Router();

router.get("/", getProfile);

export default router;