import { useState } from "react";
import ApplicantCard from "../../components/ApplicantCard";
import { mockApplicants } from "../../data/mockApplicants";

function RecruiterDashboard() {
  const [minScore, setMinScore] = useState(0);

  const filteredApplicants = mockApplicants.filter(
    (a) => a.matchScore >= minScore
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applicants</h1>

      <div className="mb-4">
        <label className="text-sm mr-2">Minimum Match Score:</label>
        <input
          type="number"
          className="border px-2 py-1 w-20"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
        />
      </div>

      {filteredApplicants.length === 0 ? (
        <p className="text-gray-500">No applicants meet the criteria.</p>
      ) : (
        filteredApplicants.map((applicant) => (
          <ApplicantCard
            key={applicant.id}
            name={applicant.name}
            matchScore={applicant.matchScore}
            skillsMatched={applicant.skillsMatched}
          />
        ))
      )}
    </div>
  );
}

export default RecruiterDashboard;
