import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

type Job = {
  _id: string;
  title: string;
  location: string;
  experience: number;
  type: string;
  isRemoteJob: boolean;
  createdAt: string;
};

function BrowseJobsTab() {
  console.log("BrowseJobsTab mounted");

  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/all");
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => navigate(`/applicant/jobs/${job._id}`)}
            className="border rounded-lg p-5 space-y-3 hover:shadow-md transition cursor-pointer bg-white"
          >
            {/* TITLE */}
            <h3 className="text-lg font-semibold text-gray-900">
              {job.title}
            </h3>

            {/* META */}
            <p className="text-sm text-gray-600">
              {job.location} • {job.experience}+ yrs •{" "}
              {job.type}
            </p>

            {/* TAGS */}
            <div className="flex gap-2 flex-wrap">
              {job.isRemoteJob && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  Remote
                </span>
              )}
            </div>

            {/* FOOTER */}
            <p className="text-xs text-gray-500">
              Posted on{" "}
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default BrowseJobsTab;
