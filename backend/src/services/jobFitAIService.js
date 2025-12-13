import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateJobFitExplanation(explanation = {}) {
  const matchedSkills = Array.isArray(explanation.matchedSkills)
    ? explanation.matchedSkills
    : [];

  const missingSkills = Array.isArray(explanation.missingSkills)
    ? explanation.missingSkills
    : [];

  const experienceGap =
    typeof explanation.experienceGap === "number"
      ? explanation.experienceGap
      : null;

  const missingSkillsText = missingSkills.length
    ? missingSkills.join(", ")
    : "none";

  return `
You match ${matchedSkills.length} required skills.
Missing skills: ${missingSkillsText}.
${
  experienceGap !== null
    ? `You need ${experienceGap} more years of experience.`
    : "Experience requirement is met."
}
`.trim();
}