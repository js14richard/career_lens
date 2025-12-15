type Applicant = {
  name: string;
  matchScore: number;
  skillsMatched: string[];
};

function ApplicantCard({ name, matchScore, skillsMatched }: Applicant) {
  return (
    <div className="border rounded-lg p-4 mb-3">
      <div className="flex justify-between">
        <h3 className="font-semibold">{name}</h3>
        <span className="font-bold">{matchScore}%</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {skillsMatched.map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ApplicantCard;
