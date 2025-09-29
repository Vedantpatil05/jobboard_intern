import { Router, Request, Response } from "express";
import { mergeUserData } from "../services/mergeUserData.js";

const router = Router();

/**
 * @route   POST /api/user
 * @desc    Merge static user data + roadmap + preassessment + form input
 * @access  Public (later we’ll add auth)
 */
router.post("/", (req: Request, res: Response) => {
  try {
    const { user_uid, form_input } = req.body;

    if (!user_uid || !form_input) {
      return res.status(400).json({ error: "user_uid and form_input are required" });
    }

    const mergedProfile = mergeUserData(user_uid, form_input);

    return res.status(200).json({
      message: "Profile saved successfully",
      profile: mergedProfile,
    });
  } catch (err: any) {
    console.error("Error in /api/user:", err);
    return res.status(500).json({ error: "Failed to save profile" });
  }
});

export default router;
