import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../../api/axios";

type Job = {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  experience: number;
  type: string;
  location: string;
  createdAt: string;
};

console.log("loaded job details");

function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const applicationStatus =
    (location.state as any)?.applicationStatus;

  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!id) return;

    api.get(`/jobs/${id}`).then((res) => {
      setJob(res.data.job);
    });
  }, [id]);

  if (!job) return <p>Loading job details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link to={-1 as any} className="text-blue-600 text-sm underline">
        ← Back
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">
            {job.title}
          </h2>
          <p className="text-gray-600">
            {job.location} • {job.type} • {job.experience}+ yrs
          </p>
        </div>

        {applicationStatus && (
          <span className="bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 rounded-full text-sm font-medium">
            {applicationStatus.toUpperCase()}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-medium mb-1">Description</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {job.description}
        </p>
      </div>

      <div>
        <h3 className="font-medium mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Apply Now
      </button>

      <p className="text-xs text-gray-500">
        Posted on{" "}
        {new Date(job.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default JobDetails;
