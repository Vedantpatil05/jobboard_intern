import { Router } from "express";
import fs from "fs";
import path from "path";
import { getEmbedding } from "../services/embeddings.js";
import { cosineSimilarity } from "../services/similarity.js";

const router = Router();

router.get("/match", async (req, res) => {
  try {
    const userPath = path.join(process.cwd(), "data", "user.json");
    const userData = JSON.parse(fs.readFileSync(userPath, "utf-8"));

    const profileText = [
      ...(userData.form_input?.skills || []),
      userData.form_input?.job_role || "",
      ...(userData.roadmap_skills || []),
      ...(userData.interests || [])
    ].join(" ");

    if (!profileText.trim()) {
      return res.status(400).json({ error: "No user data available" });
    }

    const userEmbedding = await getEmbedding(profileText);

    const jobsPath = path.join(process.cwd(), "data", "jobs_with_embeddings.json");
    const jobsData = JSON.parse(fs.readFileSync(jobsPath, "utf-8"));
    
    // Read preassessments data for soft skills
    const preassessmentsPath = path.join(process.cwd(), "data", "edquest.edquest.preassesments.json");
    const preassessmentsData = JSON.parse(fs.readFileSync(preassessmentsPath, "utf-8"));
    
    // Get user preassessments data (first entry for the current user)
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
    
    // Generate embeddings for hard skills and soft skills
    const hardSkillsEmbedding = await getEmbedding(userHardSkillsText);
    const softSkillsEmbedding = await getEmbedding(userSoftSkillsText);
    
    // Process all jobs with async operations
    const results = await Promise.all(jobsData.map(async (job: any) => {
      if (!job.embedding) return { ...job, matchPercent: 0, hardSkillPercent: 0, softSkillPercent: 0 };
      
      // ✅ HARD SKILL SCORE: User (form input + roadmap skills) embedding vs Job embedding
      const hardSkillScore = cosineSimilarity(hardSkillsEmbedding, job.embedding);
      const hardSkillPercent = Math.round(hardSkillScore * 100);
      
      // ✅ SOFT SKILL SCORE: Preassessments embedding vs Job embedding
      const softSkillScore = cosineSimilarity(softSkillsEmbedding, job.embedding);
      const softSkillPercent = Math.round(softSkillScore * 100);
      
      // ✅ OVERALL MATCH PERCENTAGE: Average of hard skill and soft skill scores
      const overallMatchScore = (hardSkillScore + softSkillScore) / 2;
      const matchPercent = Math.round(overallMatchScore * 100);
      
      // ✅ Map backend data structure to frontend expectations
      const mappedJob = {
        ...job,
        matchPercent,
        hardSkillPercent,
        softSkillPercent,
        // Add requirements array with user skills for frontend skill tags
        requirements: [...formInputSkills, ...roadmapSkills],
        // Map postedAt field that frontend expects
        postedAt: job.howRecent || job.postedDate || "Recently",
        // Ensure jobId is available (should already be there)
        jobId: job.jobId,
        // Map other fields that frontend expects
        title: job.title,
        company: job.company,
        location: job.location,
        // Map jobDescription field that frontend expects
        jobDescription: job.roleOverview || job.jobDescription || "No description available",
        // Map applyUrl field that frontend expects
        applyUrl: job.applyLink || job.applyUrl || "#",
        // Map companyUrl field
        companyUrl: job.companyUrl || ""
      };
      
      return mappedJob;
    }));

    results.sort((a: any, b: any) => b.matchPercent - a.matchPercent);

    res.json({ user: userData, matches: results });
  } catch (err) {
    console.error("Match error:", err);
    res.status(500).json({ error: "Failed to match" });
  }
});

export default router;
