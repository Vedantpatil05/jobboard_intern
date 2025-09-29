import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/skill-stats", async (req, res) => {
  try {
    // Read category-wise roadmap data
    const categoryRoadmapPath = path.join(process.cwd(), "data", "categorywiseroadmap.json");
    const categoryRoadmapData = JSON.parse(fs.readFileSync(categoryRoadmapPath, "utf-8"));

    // Read completed roadmap data
    const completedRoadmapPath = path.join(process.cwd(), "data", "completedroadmapdata.json");
    const completedRoadmapData = JSON.parse(fs.readFileSync(completedRoadmapPath, "utf-8"));

    // Calculate total roadmaps (sum of all total_roadmaps, ignoring started_roadmaps)
    const totalRoadmaps = categoryRoadmapData.reduce((sum: number, category: any) => {
      return sum + category.total_roadmaps;
    }, 0);

    // Calculate completed roadmaps (sum of all category values from completed data)
    // We'll use the first user's completed data for now
    const userCompletedData = completedRoadmapData[0] || {};
    const completedRoadmaps = Object.keys(userCompletedData)
      .filter(key => key !== "_id") // Exclude the _id field
      .reduce((sum: number, key: string) => {
        return sum + (userCompletedData[key] || 0);
      }, 0);

    // Calculate skill score percentage
    const skillScore = totalRoadmaps > 0 ? Math.round((completedRoadmaps / totalRoadmaps) * 100) : 0;

    // Return the calculated stats
    res.json({
      skillScore,
      totalRoadmaps,
      completedRoadmaps,
      certificates: 8 // Keeping certificates as 8 for now as it's not in our data
    });

  } catch (error) {
    console.error("Error calculating skill stats:", error);
    res.status(500).json({ error: "Failed to calculate skill stats" });
  }
});

export default router;
