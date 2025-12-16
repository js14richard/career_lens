import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

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
  const { isAuthenticated, role } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (role !== "candidate") {
      alert("Only candidates can apply for jobs");
      return;
    }

    try {
      const res = await api.post(`/applications/apply/${jobId}`);
      navigate(`/candidate/applications/${res.data.application._id}`);
    } catch {
      alert("Failed to apply for job");
    }
  };

  if (loading) return <p className="p-6">Loading job...</p>;
  if (error || !job) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-600 mb-4">{job.location}</p>

      <p className="mb-4">{job.description}</p>

      <h3 className="font-semibold">Required Skills</h3>
      <div className="flex flex-wrap gap-2 mt-2 mb-6">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="bg-gray-100 px-2 py-1 text-sm rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      <button
        onClick={handleApply}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        {isAuthenticated ? "Apply & See Match Score" : "Login to Apply"}
      </button>
    </div>
  );
}

export default PublicJobDetails;
