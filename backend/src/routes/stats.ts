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

    // Read preassessments data for personality scores
    const preassessmentsPath = path.join(process.cwd(), "data", "edquest.edquest.preassesments.json");
    const preassessmentsData = JSON.parse(fs.readFileSync(preassessmentsPath, "utf-8"));

    // Read user data to get user_uid for matching
    const userPath = path.join(process.cwd(), "data", "user.json");
    const userData = JSON.parse(fs.readFileSync(userPath, "utf-8"));

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

    // Calculate skill score percentage - USER'S TECHNICAL SKILL LEVEL
    const skillScore = totalRoadmaps > 0 ? Math.round((completedRoadmaps / totalRoadmaps) * 100) : 0;

    console.log("Calculated stats:", {
      skillScore,
      totalRoadmaps,
      completedRoadmaps,
      categories: categoryRoadmapData.map((c: any) => ({ category: c.category, total: c.total_roadmaps, completed: userCompletedData[c.category] || 0 }))
    })

    // Calculate personality score from preassessments data
    const userPreassessments = preassessmentsData.find((p: any) => p.user_uid === userData.user_uid) || preassessmentsData[0];
    const personalityCategoryScores = userPreassessments?.personality_category_scores || {};

    // Calculate overall personality score (average of all personality categories)
    const personalityCategories = Object.values(personalityCategoryScores) as number[];
    const personaScore = personalityCategories.length > 0
      ? Math.round(personalityCategories.reduce((sum: number, score: number) => sum + score, 0) / personalityCategories.length)
      : 0;

    // Calculate overall score (weighted average of skill and personality) - USER'S OVERALL PROFILE SCORE
    const overallScore = Math.round((skillScore * 0.7) + (personaScore * 0.3));

    console.log("Final stats:", {
      skillScore,
      personaScore,
      overallScore,
      totalRoadmaps,
      completedRoadmaps
    })

    // Return the calculated stats
    res.json({
      skillScore,
      personaScore,
      overallScore,
      totalRoadmaps,
      completedRoadmaps,
      certificates: 8, // Keeping certificates as 8 for now as it's not in our data
      personalityCategoryScores,
      softSkillScores: userPreassessments?.soft_skill_scores || {}
    });

  } catch (error) {
    console.error("Error calculating skill stats:", error);
    res.status(500).json({ error: "Failed to calculate skill stats" });
  }
});

// New endpoint for job-specific matches
router.get("/job-match/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    // Read user data
    const userPath = path.join(process.cwd(), "data", "user.json");
    const userData = JSON.parse(fs.readFileSync(userPath, "utf-8"));

    // Read jobs data
    const jobsPath = path.join(process.cwd(), "data", "jobs_with_embeddings.json");
    const jobsData = JSON.parse(fs.readFileSync(jobsPath, "utf-8"));

    // Read preassessments data
    const preassessmentsPath = path.join(process.cwd(), "data", "edquest.edquest.preassesments.json");
    const preassessmentsData = JSON.parse(fs.readFileSync(preassessmentsPath, "utf-8"));

    // Find the specific job
    const job = jobsData.find((j: any) => j.jobId === jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Get user preassessments data
    const userPreassessments = preassessmentsData.find((p: any) => p.user_uid === userData.user_uid) || preassessmentsData[0];

    // Create hard skills text from both roadmap skills and form input skills
    const formInputSkills = userData.form_input?.skills || [];
    const roadmapSkills = userData.roadmap_skills || [];
    const userHardSkillsText = [...formInputSkills, ...roadmapSkills].join(" ");

    // Create soft skills text from preassessments data
    const softSkillsData = userPreassessments?.soft_skill_scores || {};
    const personalityData = userPreassessments?.personality_category_scores || {};
    const userSoftSkillsText = [
      ...Object.keys(softSkillsData).map(skill => skill.replace(/_/g, " ")),
      ...Object.keys(personalityData).map(skill => skill.replace(/_/g, " "))
    ].join(" ");

    // Import embedding and similarity functions
    const { getEmbedding } = await import("../services/embeddings.js");
    const { cosineSimilarity } = await import("../services/similarity.js");

    // Generate embeddings for hard skills and soft skills
    const hardSkillsEmbedding = await getEmbedding(userHardSkillsText);
    const softSkillsEmbedding = await getEmbedding(userSoftSkillsText);

    // Calculate hard skill match
    const hardSkillScore = job.embedding ? cosineSimilarity(hardSkillsEmbedding, job.embedding) : 0;
    const hardSkillPercent = Math.round(hardSkillScore * 100);

    // Calculate soft skill match
    const softSkillScore = job.embedding ? cosineSimilarity(softSkillsEmbedding, job.embedding) : 0;
    const softSkillPercent = Math.round(softSkillScore * 100);

    // Calculate overall match
    const overallMatchScore = (hardSkillScore + softSkillScore) / 2;
    const overallMatchPercent = Math.round(overallMatchScore * 100);

    res.json({
      jobId,
      hardSkillPercent,
      softSkillPercent,
      overallMatchPercent,
      jobTitle: job.title,
      company: job.company
    });

  } catch (error) {
    console.error("Error calculating job match:", error);
    res.status(500).json({ error: "Failed to calculate job match" });
  }
});

export default router;
