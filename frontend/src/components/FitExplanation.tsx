type Props = {
  matchScore: number;
  missingSkills: string[];
};

function FitExplanation({ matchScore, missingSkills }: Props) {
  if (matchScore >= 80) {
    return (
      <p className="mt-3 text-green-700 text-sm">
        ✅ You are a strong match for this role.
      </p>
    );
  }

  return (
    <div className="mt-3 text-sm">
      <p className="text-red-600 font-medium">
        ❌ You are not a perfect fit yet.
      </p>

      <p className="mt-1 text-gray-600">
        Improve your chances by learning:
      </p>

      <ul className="list-disc ml-5 mt-1 text-gray-700">
        {missingSkills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}

export default FitExplanation;
