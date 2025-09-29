"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SingleSelect from "@/components/SingleSelect";
import NumberSelect from "@/components/NumberSelect";
import MultiSelectCreatable from "@/components/MultiSelectCreatable";

// Predefined dropdown lists
const educationOptions = [
  "High School",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
  "PhD",
  "Other",
];

const streamOptions = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Commerce",
  "Arts",
  "Biotech",
  "Law",
  "Data Science",
  "Electrical",
];

const roleOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "QA Engineer",
  "UI/UX Designer",
  "Mobile App Developer",
  "Cloud Engineer",
];

const skillSuggestions = [
  "React",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "TailwindCSS",
  "Node.js",
  "Express",
  "MongoDB",
  "Python",
  "Django",
  "SQL",
  "Postgres",
  "AWS",
  "Docker",
  "Kubernetes",
  "C++",
  "Java",
  "Git",
  "Figma",
  "Redux",
  "Angular",
];

const experienceNumbers = Array.from({ length: 21 }, (_, i) => i); // 0..20 years

export default function ProfilePage() {
  const router = useRouter();

  // form state
  const [education, setEducation] = useState<string | null>(null);
  const [stream, setStream] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [experience, setExperience] = useState<number | null>(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // NOTE: replace this with actual logged-in user UID
    const user_uid = "ed66c09841a773130";

    const body = {
      user_uid,
      form_input: {
        education_level: education ?? "",
        stream: stream ?? "",
        job_role: role ?? "",
        experience_years: experience ?? 0,
        skills,
      },
    };

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      console.log("Saved profile:", await res.json());

      // 🚀 Redirect to landing page
      router.push("/home");
    } catch (err: any) {
      console.error(err);
      alert("Error saving profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white dark:bg-slate-900 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Complete your Profile
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Fill in your education, stream, role, experience and skills.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SingleSelect
            label="Education Level"
            options={educationOptions}
            value={education}
            onChangeAction={setEducation}
          />
          <SingleSelect
            label="Stream / Domain"
            options={streamOptions}
            value={stream}
            onChangeAction={setStream}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SingleSelect
            label="Preferred Role"
            options={roleOptions}
            value={role}
            onChangeAction={setRole}
          />
          <NumberSelect
            label="Experience (Years)"
            options={experienceNumbers}
            value={experience}
            onChangeAction={setExperience}
          />
        </div>

        {/* Skills */}
        <MultiSelectCreatable
          label="Skills"
          options={skillSuggestions}
          value={skills}
          onChangeAction={setSkills}
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border px-5 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => router.push("/home")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
