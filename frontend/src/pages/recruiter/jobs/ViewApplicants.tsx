import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../api/axios";

type Applicant = {
  _id: string; // application id
  createdAt: string;
  status: string;
  analysis?: {
    matchScore?: number;
  };
  applicantId: {
    _id: string;
    name: string;
    profile: {
      headline: string;
    };
  };
};

function ViewApplicants() {
  const { jobId } = useParams<{ jobId: string }>();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minMatchScore, setMinMatchScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(
          `/applications/job/${jobId}/applicants`
        );
        setApplicants(res.data.applicants || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchApplicants();
  }, [jobId]);

  const filteredApplicants = applicants.filter((app) => {
    if (minMatchScore === null) return true;
    return (app.analysis?.matchScore ?? 0) >= minMatchScore;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Applicants</h2>

        <Link
          to={`/recruiter/dashboard/jobs/${jobId}`}
          className="text-sm text-blue-600 underline"
        >
          Back to Job Details
        </Link>
      </div>

      {/* FILTER */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">
          Filter by Match Score:
        </label>

        <select
          value={minMatchScore ?? ""}
          onChange={(e) =>
            setMinMatchScore(
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="">All</option>
          <option value="30">30%+</option>
          <option value="50">50%+</option>
          <option value="70">70%+</option>
        </select>
      </div>

      {/* EMPTY / LIST */}
      {filteredApplicants.length === 0 ? (
        <p className="text-gray-500">
          No applicants match the selected filter.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => (
            <div
              key={app._id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div className="space-y-1">
                {/* NAME + STATUS */}
                <div className="flex items-center gap-2">
                  <p className="font-medium text-lg">
                    {app.applicantId.name}
                  </p>

                  <span
                    className={`border px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      app.status
                    )}`}
                  >
                    {app.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {app.applicantId.profile.headline}
                </p>

                {app.analysis?.matchScore !== undefined && (
                  <p className="text-sm text-green-600 font-medium">
                    Match Score: {app.analysis.matchScore}%
                  </p>
                )}

                <p className="text-xs text-gray-500">
                  Applied on{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Link
                to={`/recruiter/dashboard/applicants/${app.applicantId._id}`}
                state={{ applicant: app }}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewApplicants;
