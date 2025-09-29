import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Types ----------
export interface FormInput {
  education_level: string;
  stream: string;
  job_role: string;
  experience_years: number;
  skills: string[];
}

export interface PersonaAnalysis {
  communication: number;
  teamwork: number;
  problem_solving: number;
  leadership: number;
  adaptability: number;
}

export interface MergedProfile {
  user_uid: string;
  name: string;
  email: string;
  interests: string[];
  roadmap_skills: string[];
  persona_analysis: PersonaAnalysis;
  form_input: FormInput;
}

// ---------- Paths ----------
const userProfilePath = path.join(
  __dirname,
  "../../data/edquest.edquest.userprofiles_kaushal.json"
);
const roadmapPath = path.join(
  __dirname,
  "../../data/edquest.edquest.roadmaps_kaushal.json"
);
const preassessmentsPath = path.join(
  __dirname,
  "../../data/edquest.edquest.preassesments.json"
);

const mergedOutputPath = path.join(__dirname, "../../data/merged_profiles.json");

console.log("🔍 File paths debug:");
console.log("- userProfilePath:", userProfilePath);
console.log("- roadmapPath:", roadmapPath);
console.log("- preassessmentsPath:", preassessmentsPath);
console.log("- mergedOutputPath:", mergedOutputPath);

// ---------- Main Function ----------
export function mergeUserData(
  user_uid: string,
  formInput: FormInput
): MergedProfile {
  // 1. Load static files safely
  const userProfileRaw = JSON.parse(fs.readFileSync(userProfilePath, "utf-8"));
  const roadmapDataRaw = JSON.parse(fs.readFileSync(roadmapPath, "utf-8"));
  const preassessmentsRaw = JSON.parse(
    fs.readFileSync(preassessmentsPath, "utf-8")
  );

  // If user_uid is passed, try to find matching user
  let userProfile: any = null;
  if (Array.isArray(userProfileRaw)) {
    userProfile =
      userProfileRaw.find((u) => u.user_uid === user_uid) || userProfileRaw[0];
  } else {
    userProfile = userProfileRaw;
  }

  if (!userProfile) {
    throw new Error(`User with uid ${user_uid} not found`);
  }

  // 2. Extract roadmap skills
  const roadmap_skills: string[] = Array.isArray(roadmapDataRaw)
    ? roadmapDataRaw.flatMap((r: any) => r.skill_objectives || [])
    : [];

  // 3. Extract persona analysis safely
  let persona_analysis: PersonaAnalysis = {
    communication: 0,
    teamwork: 0,
    problem_solving: 0,
    leadership: 0,
    adaptability: 0,
  };

  console.log("🚀 MERGE FUNCTION DEBUG:");
  console.log("- Input user_uid:", user_uid);
  console.log("- preassessmentsRaw type:", typeof preassessmentsRaw);
  console.log("- preassessmentsRaw isArray:", Array.isArray(preassessmentsRaw));
  console.log("- preassessmentsRaw length:", Array.isArray(preassessmentsRaw) ? preassessmentsRaw.length : 'N/A');

  if (Array.isArray(preassessmentsRaw) && preassessmentsRaw.length > 0) {
    // Find preassessment data for the specific user
    const userPreassessment = preassessmentsRaw.find((p: any) => p.user_uid === user_uid);
    console.log("- userPreassessment found by UID:", !!userPreassessment);
    
    // If not found by UID, use first one as fallback
    const fallbackPreassessment = userPreassessment || preassessmentsRaw[0];
    console.log("- fallbackPreassessment user_uid:", fallbackPreassessment?.user_uid);
    
    const softSkills = fallbackPreassessment.soft_skill_scores || {};
    console.log("- softSkills object:", softSkills);
    console.log("- softSkills keys:", Object.keys(softSkills));
    
    persona_analysis = {
      communication: softSkills.communication || 0,
      teamwork: softSkills.teamwork_and_collaboration || 0,
      problem_solving: softSkills.problem_solving || 0,
      leadership: softSkills.leadership || 0,
      adaptability: softSkills.adaptability_and_flexibility || 0,
    };
    
    console.log("- Final persona_analysis:", persona_analysis);
  } else {
    console.log("❌ No preassessments data found!");
    console.log("- preassessmentsRaw:", preassessmentsRaw);
  }

  // 4. Build merged object
  const mergedProfile: MergedProfile = {
    user_uid: user_uid || userProfile.user_uid || userProfile.uid,
    name:
      userProfile.username ||
      `${userProfile.first_name ?? ""} ${userProfile.last_name ?? ""}`.trim(),
    email: userProfile.email,
    interests: userProfile.interests || [],
    roadmap_skills,
    persona_analysis,
    form_input: formInput,
  };

  // 5. Save into merged_profiles.json (append or update if already exists)
  let existing: MergedProfile[] = [];
  if (fs.existsSync(mergedOutputPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(mergedOutputPath, "utf-8"));
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }
  }

  // Check if profile with same uid exists → update instead of duplicating
  const existingIndex = existing.findIndex(
    (p) => p.user_uid === mergedProfile.user_uid
  );
  if (existingIndex >= 0) {
    existing[existingIndex] = mergedProfile;
  } else {
    existing.push(mergedProfile);
  }

  console.log("💾 About to write to file:", mergedOutputPath);
  console.log("💾 Data to write:", JSON.stringify(existing, null, 2));
  
  fs.writeFileSync(mergedOutputPath, JSON.stringify(existing, null, 2));
  
  console.log("✅ File written successfully");
  console.log("📁 Verifying file contents after write:");
  const verifyContent = JSON.parse(fs.readFileSync(mergedOutputPath, "utf-8"));
  const verifyProfile = verifyContent.find((p: any) => p.user_uid === mergedProfile.user_uid);
  console.log("📁 Verified persona_analysis:", verifyProfile?.persona_analysis);

  return mergedProfile;
}
