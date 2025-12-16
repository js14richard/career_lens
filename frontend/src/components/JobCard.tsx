import FitExplanation from "./FitExplanation";

type Job = {
  title: string;
  location: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
};

function JobCard({
  title,
  location,
  matchScore,
  matchedSkills,
  missingSkills,
}: Job) {
  const hasMatchScore = matchScore > 0;

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>

        {hasMatchScore && (
          <span
            className={`font-bold ${
              matchScore >= 80
                ? "text-green-600"
                : matchScore >= 60
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {matchScore}% Match
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500">{location}</p>

      {hasMatchScore && matchedSkills.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium">Matched Skills:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}


      {missingSkills.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium">
            {hasMatchScore ? "Missing Skills:" : "Required Skills:"}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasMatchScore && (
        <FitExplanation
          matchScore={matchScore}
          missingSkills={missingSkills}
        />
      )}

      {!hasMatchScore && (
        <p className="mt-3 text-sm text-gray-500">
          Apply to see your personalized match score.
        </p>
      )}
    </div>
  );
}

export default JobCard;
