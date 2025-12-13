export function calculateJobMatch(job, applicant) {

  const jobSkills = Array.isArray(job?.skills) ? job.skills : [];
  const applicantSkills = Array.isArray(applicant?.skills)
    ? applicant.skills
    : [];

  const jobExperience = Number.isFinite(Number(job?.experience))
    ? Number(job.experience)
    : 0;

  const applicantExperience = Number.isFinite(
    Number(applicant?.experienceYears)
  )
    ? Number(applicant.experienceYears)
    : 0;

  const explanation = {
    matchedSkills: [],
    missingSkills: [],
    experienceGap: null,
    summary: ""
  };

  const requiredSkills = jobSkills.map(s => s.toLowerCase());
  const candidateSkills = applicantSkills.map(s => s.toLowerCase());

  for (const skill of requiredSkills) {
    if (candidateSkills.includes(skill)) {
      explanation.matchedSkills.push(skill);
    } else {
      explanation.missingSkills.push(skill);
    }
  }

  const matchedCount = explanation.matchedSkills.length;
  const requiredCount = requiredSkills.length;

  const skillMatchPercent =
    requiredCount === 0 ? 0 : (matchedCount / requiredCount) * 100;

  let experienceScore = 100;

  if (jobExperience > 0 && applicantExperience < jobExperience) {
    experienceScore = (applicantExperience / jobExperience) * 100;
    explanation.experienceGap = jobExperience - applicantExperience;
  }


  const rawScore =
    skillMatchPercent * 0.7 + experienceScore * 0.3;

  const matchScore = Number.isFinite(rawScore)
    ? Math.round(rawScore)
    : 0;

  explanation.summary = `
    Matched ${matchedCount}/${requiredCount} required skills.
    ${
      explanation.missingSkills.length
        ? `Missing skills: ${explanation.missingSkills.join(", ")}.`
        : "All required skills matched."
    }
    ${
      explanation.experienceGap !== null
        ? `Needs ${explanation.experienceGap} more years of experience.`
        : "Experience requirement met."
    }
    `.trim();

  return { matchScore, explanation };
}