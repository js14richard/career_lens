import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";

type Job = {
  _id: string;
  title: string;
  location: string;
  experience: number;
  type: string;
  isRemoteJob: boolean;
};

function ApplicantJobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
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

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Available Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="font-medium text-lg">{job.title}</p>

                <p className="text-sm text-gray-600">
                  {job.location} • {job.experience}+ yrs • {job.type}
                </p>

                <p className="text-sm text-gray-500">
                  {job.isRemoteJob ? "Remote" : "Onsite"}
                </p>
              </div>

              <Link
                to={`/applicant/jobs/${job._id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantJobList;
