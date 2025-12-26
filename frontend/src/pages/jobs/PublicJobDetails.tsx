import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

/* =======================
   TYPES
======================= */
type Job = {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  experience: number;
  location: string;
  type: string;
};

function PublicJobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================
     FETCH JOB
  ======================= */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${jobId}`);
        setJob(res.data.job);
      } catch {
        setError("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  /* =======================
     APPLY HANDLER
  ======================= */
  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await api.post(`/applications/apply/${jobId}`);
      navigate("/applicant/dashboard");
    } catch {
      alert("Failed to apply for job");
    }
  };

  /* =======================
     UI STATES
  ======================= */
  if (loading) return <p className="p-6">Loading job...</p>;
  if (error || !job)
    return <p className="p-6 text-red-600">{error}</p>;

  /* =======================
     UI
  ======================= */
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-gray-600">
          {job.location} • {job.type} • {job.experience}+ yrs
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-1">Job Description</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {job.description}
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="bg-gray-100 px-3 py-1 text-sm rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleApply}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {isAuthenticated ? "Apply Now" : "Login to Apply"}
      </button>
    </div>
  );
}

export default PublicJobDetails;
