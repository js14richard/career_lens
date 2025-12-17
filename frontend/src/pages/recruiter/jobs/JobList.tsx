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
        console.log("📡 Calling /jobs/my-jobs");
        const res = await api.get("/jobs/my-jobs");
        setJobs(res.data.jobs || []);
      } catch (err) {
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
  if (loading) {
    return <p className="text-gray-500">Loading jobs...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

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
     JOB LIST
  ======================= */
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">My Job Postings</h2>

      {jobs.map((job) => (
        <Link
          key={job._id}
          to={`/recruiter/dashboard/jobs/${job._id}`}
          className="block border rounded-lg p-4 hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{job.title}</h3>
              <p className="text-sm text-gray-600">
                {job.location} • {job.type}
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {job.experience}+ yrs
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default JobList;
