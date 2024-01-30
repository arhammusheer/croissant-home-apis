import { NextFunction, Request, Response } from "express";
import AuthProvider from "../classes/auth.class";
import ProfileProvider from "../classes/profiles.class";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken } = req.query as { accessToken: string };

    if (!accessToken) {
      res.status(400).json({ error: "Missing access token" });
      return;
    }

    const profile = await new ProfileProvider(accessToken).getProfile();
    
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};
