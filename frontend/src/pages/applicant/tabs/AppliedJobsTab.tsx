import { useEffect, useState } from "react";
import api from "../../../api/axios";

type Application = {
  _id: string;
  status: string;
  createdAt: string;
  analysis?: {
    matchScore?: number;
    missingSkills?: string[];
  };
  jobId: {
    title: string;
    location: string;
    experience: number;
    type: string;
  };
};

function AppliedJobsTab() {
  console.log("AppliedJobsTab mounted");

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await api.get("/applications/my-applications");
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applied jobs", err);
        setError("Failed to load applied jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "shortlisted":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      case "applied":
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  if (loading) return <p>Loading applied jobs...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {applications.length === 0 ? (
        <p className="text-gray-500">
          You haven’t applied to any jobs yet.
        </p>
      ) : (
        applications.map((app) => (
          <div
            key={app._id}
            className="border rounded-lg p-5 space-y-3 bg-white hover:shadow-md transition"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {app.jobId.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {app.jobId.location} •{" "}
                  {app.jobId.experience}+ yrs •{" "}
                  {app.jobId.type}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getStatusClasses(
                  app.status
                )}`}
              >
                {app.status.toUpperCase()}
              </span>
            </div>

            {/* MATCH SCORE */}
            {typeof app.analysis?.matchScore === "number" && (
              <p className="text-sm text-green-600 font-medium">
                Match Score: {app.analysis.matchScore}%
              </p>
            )}

            {/* MISSING SKILLS */}
            {(app.analysis?.missingSkills?.length ?? 0) > 0 && (
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">
                  Missing Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {app.analysis!.missingSkills!.map((skill) => (
                    <span
                      key={skill}
                      className="bg-red-100 text-red-700 border border-red-300 text-xs px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* FOOTER */}
            <p className="text-xs text-gray-500">
              Applied on{" "}
              {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default AppliedJobsTab;
