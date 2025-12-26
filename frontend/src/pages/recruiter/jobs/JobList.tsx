import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";

/* =======================
   TYPES
======================= */
type Job = {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  experience: number;
  type: string;
  location: string;
  isRemoteJob: boolean;
  createdAt: string;
};

function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================
     FETCH MY JOBS
  ======================= */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/my-jobs");
        setJobs(res.data.jobs || []);
      } catch {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* =======================
     UI STATES
  ======================= */
  if (loading) return <p className="text-gray-500">Loading jobs...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (jobs.length === 0) {
    return (
      <div className="text-gray-600">
        <p>No jobs posted yet.</p>
        <Link
          to="/recruiter/dashboard/jobs/create"
          className="text-blue-600 underline text-sm"
        >
          Create your first job
        </Link>
      </div>
    );
  }

  /* =======================
     JOB CARDS
  ======================= */
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">My Job Postings</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Link
            key={job._id}
            to={`/recruiter/dashboard/jobs/${job._id}`}
            className="block rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">
                {job.title}
              </h3>
              <span className="text-xs text-gray-500">
                {job.experience}+ yrs
              </span>
            </div>

            {/* Meta */}
            <p className="mt-1 text-sm text-gray-600">
              {job.location} • {job.type}
              {job.isRemoteJob && " • Remote"}
            </p>

            {/* Description */}
            <p className="mt-3 text-sm text-gray-700 line-clamp-3">
              {job.description}
            </p>

            {/* Skills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 5 && (
                <span className="text-xs text-gray-500">
                  +{job.skills.length - 5} more
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 text-sm text-blue-600 font-medium">
              View details →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default JobList;
