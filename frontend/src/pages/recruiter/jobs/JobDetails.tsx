import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../api/axios";

type Job = {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  experience: number;
  type: string;
  location: string;
  isRemoteJob: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  createdAt: string;
};

function JobDetails() {
  const { jobId } = useParams<{ jobId: string }>();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${jobId}`);
        setJob(res.data.job);
      } catch {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  if (loading) {
    return <p className="text-gray-500">Loading job details...</p>;
  }

  if (error || !job) {
    return <p className="text-red-600">{error || "Job not found"}</p>;
  }

  const getSalaryText = () => {
    const currency = job.salaryCurrency || "INR";
    if (job.salaryMin && job.salaryMax)
      return `${job.salaryMin} - ${job.salaryMax} ${currency}`;
    if (job.salaryMin) return `From ${job.salaryMin} ${currency}`;
    if (job.salaryMax) return `Up to ${job.salaryMax} ${currency}`;
    return "Not disclosed";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p className="text-gray-600 text-sm">
            {job.location} • {job.type} • {job.experience}+ yrs
          </p>
        </div>

        <Link
          to="/recruiter/dashboard"
          className="text-sm text-blue-600 underline"
        >
          Back to Jobs
        </Link>
      </div>

      <div>
        <h3 className="font-medium mb-1">Job Description</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {job.description}
        </p>
      </div>

      <div>
        <h3 className="font-medium mb-2">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <p>
          <span className="font-medium">Remote:</span>{" "}
          {job.isRemoteJob ? "Yes" : "No"}
        </p>
        <p>
          <span className="font-medium">Salary:</span>{" "}
          {getSalaryText()}
        </p>
        <p>
          <span className="font-medium">Posted on:</span>{" "}
          {new Date(job.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Link
          to={`/recruiter/dashboard/jobs/${job._id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Job
        </Link>

        <Link
          to={`/recruiter/dashboard/jobs/${job._id}/applicants`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View Applicants
        </Link>
      </div>
    </div>
  );
}

export default JobDetails;
