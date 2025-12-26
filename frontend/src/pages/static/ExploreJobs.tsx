import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";


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
};

function ExploreJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/all");
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p className="text-gray-500 p-6">Loading jobs...</p>;
  if (error) return <p className="text-red-600 p-6">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Explore Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available right now.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className="block rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {job.title}
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {job.location} • {job.type}
                {job.isRemoteJob && " • Remote"}
              </p>

              <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                {job.description}
              </p>

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

              <div className="mt-4 text-sm font-medium text-blue-600">
                View Job →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExploreJobs;
