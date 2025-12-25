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

function MyApplications() {
  console.log("MyApplications mounted");

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get(
          "/applications/my-applications"
        );
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "shortlisted":
      case "selected":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <p className="text-gray-500">
          You haven’t applied to any jobs yet.
        </p>
      ) : (
        applications.map((app) => (
          <div
            key={app._id}
            className="border rounded p-4 space-y-2"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium text-lg">
                  {app.jobId.title}
                </p>
                <p className="text-sm text-gray-600">
                  {app.jobId.location} •{" "}
                  {app.jobId.experience}+ yrs •{" "}
                  {app.jobId.type}
                </p>
              </div>

              <span
                className={`border px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                  app.status
                )}`}
              >
                {app.status.toUpperCase()}
              </span>
            </div>

            {typeof app.analysis?.matchScore === "number" && (
              <p className="text-sm text-green-600 font-medium">
                Match Score: {app.analysis.matchScore}%
              </p>
            )}

            {(app.analysis?.missingSkills?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2">
                {app.analysis!.missingSkills!.map((skill) => (
                  <span
                    key={skill}
                    className="bg-red-100 text-red-700 border border-red-300 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

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

export default MyApplications;
