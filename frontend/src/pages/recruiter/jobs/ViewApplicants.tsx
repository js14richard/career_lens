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
    }
  };
};

function ViewApplicants() {
  const { jobId } = useParams<{ jobId: string }>();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      {/* Empty state */}
      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants yet.</p>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="font-medium text-lg">
                  {app.applicantId.name}
                </p>

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
