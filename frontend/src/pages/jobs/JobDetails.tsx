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

type Analysis = {
  matchScore?: number;
  missingSkills?: string[];
  summary?: string;
  aiFeedback?: string;
};

function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const applicationStatus =
    (location.state as any)?.applicationStatus;

  const [job, setJob] = useState<Job | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchJobAndAnalysis = async () => {
      try {
        const jobRes = await api.get(`/jobs/${id}`);
        setJob(jobRes.data.job);

        const analysisRes = await api.get(`/jobs/${id}/analyze`);
        setAnalysis(analysisRes.data.analysis);

        const appRes = await api.get("/applications/my-applications");
        const existingApp = appRes.data.applications?.find(
          (app: any) => app.jobId?._id === id
        );
        setAlreadyApplied(!!existingApp);
      } catch (err) {
        console.error("Failed to load job details", err);
      }
    };

    fetchJobAndAnalysis();
  }, [id]);

  const handleApply = async () => {
    if (!id || alreadyApplied) return;

    try {
      setApplying(true);
      await api.post(`/applications/apply/${id}`);
      setAlreadyApplied(true);
    } catch (err) {
      console.error("Failed to apply job", err);
      alert("Failed to apply job. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (!job) return <p>Loading job details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link to={-1 as any} className="text-blue-600 text-sm underline">
        ← Back
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">{job.title}</h2>
          <p className="text-gray-600">
            {job.location} • {job.type} • {job.experience}+ yrs
          </p>
        </div>

        {applicationStatus && (
          <span className="bg-blue-100 text-blue-700 border px-3 py-1 rounded-full text-sm">
            {applicationStatus.toUpperCase()}
          </span>
        )}
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
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {analysis && (
        <div className="border rounded p-4 space-y-3 bg-gray-50">
          <p className="text-sm font-medium">
            Match Score:{" "}
            <span className="text-green-600">
              {analysis.matchScore ?? 0}%
            </span>
          </p>

          {analysis.missingSkills?.length ? (
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">
                Missing Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-red-100 text-red-700 border text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-green-700">
              🎯 You meet all required skills
            </p>
          )}

          {analysis.aiFeedback && (
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {analysis.aiFeedback}
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleApply}
        disabled={alreadyApplied || applying}
        className={`px-4 py-2 rounded text-white ${
          alreadyApplied
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {alreadyApplied
          ? "Already Applied"
          : applying
          ? "Applying..."
          : "Apply Now"}
      </button>

      <p className="text-xs text-gray-500">
        Posted on{" "}
        {new Date(job.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default JobDetails;
