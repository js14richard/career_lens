import JobCard from "../../components/JobCard";
import { mockJobs } from "../../data/mockJobs";

function CandidateDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Job Matches</h1>

      {mockJobs.length === 0 ? (
          <p className="text-gray-500">
            No job matches available right now. Please upload your resume.
          </p>
        ) : (
          mockJobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              location={job.location}
              matchScore={job.matchScore}
              matchedSkills={job.matchedSkills}
              missingSkills={job.missingSkills}
            />
          ))
      )}

    </div>
  );
}

export default CandidateDashboard;
