export const analyzeResumeAgainstJob = (job, resume) => {
  const jobSkills = job.skills.map(s => s.toLowerCase());
  const resumeSkills = resume.skills.map(s => s.toLowerCase());

  const matchedSkills = jobSkills.filter(s =>
    resumeSkills.includes(s)
  );

  const missingSkills = jobSkills.filter(
    s => !resumeSkills.includes(s)
  );

  const matchScore = Math.round(
    (matchedSkills.length / jobSkills.length) * 100
  );

  return {
    matchScore,
    missingSkills,
    summary: resume.summary || "",
    aiFeedback: `You match ${matchedSkills.length} required skills.
Missing skills: ${missingSkills.join(", ")}.`
  };
};
