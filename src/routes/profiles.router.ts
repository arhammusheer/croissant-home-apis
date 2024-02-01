import { Router } from "express";
import { getProfile, setProfile } from "../controllers/profiles.controller";

const router = Router();

router.get("/", getProfile);
router.post("/", setProfile);

export default router;